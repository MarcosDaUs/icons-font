import { useMemo, useCallback, ReactNode, useEffect, useContext } from "react";
import ListItem, { ListItemProps } from "@mui/material/ListItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import PulseLoader from "react-spinners/PulseLoader";
import { Item } from "../../../types/icon";
import Messages from "../../../constants/messages";
import { Severity } from "../../../constants/snackbar";
import { IconsCloudFrontContext } from "../../../context/IconsCloudFront";
import { SnackBarContext } from "../../../context/SnackBarProvider";
import useCheckIconWatcher from "../../../hooks/useCheckIconWatcher";
import CloudFrontIcon from "../../atoms/CloudFrontIcon/CloudFrontIcon";
import styles from "./GalleryItemCard.module.css";

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  padding: "0",
  "& svg": {
    color: theme.palette.primary.main,
    fontSize: "20px",
  },
  "&:hover svg": {
    fill: theme.palette.secondary.main,
  },
}));

const ActionsBoxStyled = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.5rem",
  padding: "0.25rem",
  position: "absolute",
  top: "0",
  right: "0",
  zIndex: "10",
});

const ContentBoxStyled = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
  padding: "1rem 0.5rem",
  paddingTop: "0.625rem",
  width: "155px",
  minWidth: "155px",
  maxWidth: "155px",
  height: "155px",
  minHeight: "155px",
  borderWidth: "2px",
  borderStyle: "solid",
  borderRadius: "10px",
});

interface GalleryItemCardProps extends ListItemProps {
  item: Item;
  isLoading?: boolean;
  onDelete?: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onSuccessful?: (item: Item) => void;
}

const GalleryItemCard = ({
  item,
  sx,
  isLoading,
  onDelete,
  onEdit,
  onSuccessful,
}: GalleryItemCardProps) => {
  const { changeVersion } = useContext(IconsCloudFrontContext);
  const { onMessage } = useContext(SnackBarContext);

  const onTaskFailed = useCallback(() => {
    onMessage({
      message: Messages.transactionFailed,
      severity: Severity.Error,
    });
  }, [onMessage]);

  const onTaskSuccessful = useCallback(() => {
    onMessage({
      message: `the icon (${
        item?.name || ""
      }) was added to icons font successfully`,
      severity: Severity.Success,
    });
    changeVersion();
    if (onSuccessful) onSuccessful(item);
  }, [changeVersion, onMessage, onSuccessful, item]);

  const onFetchFailed = useCallback(() => {
    onMessage({
      message: Messages.transactionFailed,
      severity: Severity.Error,
    });
  }, [onMessage]);

  const { watcherStatus, initCheckIconWatcher, clearWatcherInterval } =
    useCheckIconWatcher({
      onFetchFailed: onFetchFailed,
      onFailed: onTaskFailed,
      onSuccessful: onTaskSuccessful,
    });

  const contentElement = useMemo(
    () =>
      (() => {
        let iconElement: ReactNode = <></>;
        if (!item.isFolder) {
          iconElement = isLoading ? (
            <PulseLoader color={"red"} loading={true} size={10} />
          ) : (
            <CloudFrontIcon item={item} className={styles.iconCard__icon} />
          );
        }
        return (
          <>
            {iconElement}
            <span className={styles.iconCard__name}>{item.name}</span>
          </>
        );
      })(),
    [item, isLoading]
  );

  useEffect(() => {
    if (isLoading) {
      initCheckIconWatcher(item.name);
      return () => clearWatcherInterval();
    }
    clearWatcherInterval();
  }, [item, isLoading, initCheckIconWatcher, clearWatcherInterval]);

  const withDelete = !item.isFolder || item?.items?.length === 0;

  return (
    <ListItem
      sx={{
        ...sx,
        padding: 0,
        width: "auto",
      }}
    >
      <ActionsBoxStyled>
        <IconButtonStyled onClick={() => (onEdit ? onEdit(item) : null)}>
          <EditIcon />
        </IconButtonStyled>
        {withDelete && (
          <IconButtonStyled onClick={() => (onDelete ? onDelete(item) : null)}>
            <DeleteIcon />
          </IconButtonStyled>
        )}
      </ActionsBoxStyled>

      {item.isFolder ? (
        <></>
      ) : (
        <ContentBoxStyled className={styles.iconCard}>
          {contentElement}
        </ContentBoxStyled>
      )}
    </ListItem>
  );
};

export default GalleryItemCard;
