import { useCallback, useState, useContext, useMemo } from "react";
import { Box, List, Paper, Typography, styled } from "@mui/material";
import { DeleteIconRequest, Item } from "../../types/icon";
import { Modes } from "../../constants/crud";
import { Severity } from "../../constants/snackbar";
import Messages from "../../constants/messages";
import { LoadingContext } from "../../context/LoadingProvider";
import { SnackBarContext } from "../../context/SnackBarProvider";
import useDialogAction from "../../hooks/useDialogAction";
import CrudHeader from "../molecules/CrudHeader";
import useFilterBox from "../atoms/FilterBox/hooks/useFilterBox";
import FilterBox from "../atoms/FilterBox/FilterBox";
import IconsPanel from "./IconsPanel";
import GalleryItemCard from "../molecules/GalleryItemCard/GalleryItemCard";
import deleteIcon from "../../services/deleteIcon";
import useDeleteItemDialog from "../../hooks/useDeleteItemDialog";
import DeleteItemDialog from "../molecules/DeleteItemDialog";

const MainBoxStyled = styled(Box)({
  display: "flex",
  flexGrow: "1",
  flexDirection: "column",
});

const ContentBoxStyled = styled(Box)({
  display: "flex",
  flexGrow: "1",
  flexDirection: "column",
  padding: "20px 24px",
  gap: "16px",
});

const HiddenBoxStyled = styled(Box)({
  display: "none",
});

const PaperStyled = styled(Paper)({
  display: "flex",
  padding: "1rem",
});

type GalleryProps = {
  icons?: Item[];
  loadGalleryItems: () => void;
};

const Gallery = ({ icons, loadGalleryItems }: GalleryProps) => {
  const [selectedIcon, setSelectedIcon] = useState<Item>();
  const [loadingIcons, setLoadingIcons] = useState<Item[]>([]);

  const { isLoading, setLoadingState } = useContext(LoadingContext);
  const { onMessage } = useContext(SnackBarContext);

  const confirmDeletionHandler = useCallback(
    async (item?: Item) => {
      setLoadingState(true);

      if (item === undefined || item.isFolder) return;

      const deleteBody: DeleteIconRequest = {
        path: item.path,
      };
      deleteIcon(deleteBody)
        .then(() => {
          onMessage({
            severity: Severity.Success,
            message: Messages.iconDeletedSuccessfully,
          });
          loadGalleryItems();
        })
        .catch(() => {
          onMessage({
            message: Messages.transactionFailed,
            severity: Severity.Error,
          });
        })
        .finally(() => {
          setLoadingState(false);
        });
    },
    [onMessage, setLoadingState, loadGalleryItems]
  );

  const {
    value: filterValue,
    inputValue: filterBoxValue,
    error: filterWithError,
    handleChangeValue,
    handleClearValue,
  } = useFilterBox({});

  const {
    itemNameToDelete,
    isOpenDeleteItemDialog,
    showDeleteItemDialog,
    onCancelDeleteItemDialog,
    onConfirmDeleteItemDialog,
  } = useDeleteItemDialog<Item>({
    onConfirmDialog: confirmDeletionHandler,
  });

  const {
    isOpenDialog: isOpenIconsDialog,
    isDialogMount: isIconsDialogMount,
    onCloseDialog: onCloseIconsDialog,
    onExitedDialog: onExitedIconsDialog,
    onOpenDialog: onOpenIconsDialog,
  } = useDialogAction();

  const onClickItemAddMenu = useCallback(() => {
    setSelectedIcon(undefined);
    onOpenIconsDialog();
  }, [onOpenIconsDialog]);

  const onClickItemDeleteIcon = useCallback(
    (item: Item) => {
      showDeleteItemDialog(item.name, item);
    },
    [showDeleteItemDialog]
  );

  const onClickItemEditIcon = useCallback(
    (icon: Item) => {
      setSelectedIcon({ ...icon });
      onOpenIconsDialog();
    },
    [onOpenIconsDialog]
  );

  const onSuccessfulCheckIconFont = useCallback(
    (icon: Item) => {
      setLoadingIcons((loadingIcons) => {
        const newItems = loadingIcons.filter(
          (loadingIcon) => icon.path !== loadingIcon.path
        );
        return newItems;
      });
      loadGalleryItems();
    },
    [loadGalleryItems]
  );

  const onSaveIcon = useCallback(
    (icon: Item) => {
      setLoadingIcons((loadingIcons) => {
        const sameIcon = loadingIcons.find(
          (loadingIcon) => icon.path === loadingIcon.path
        );
        if (sameIcon) {
          return [...loadingIcons];
        }
        return [...loadingIcons, { ...icon }];
      });

      const isEdited = Boolean(selectedIcon?.name);
      onMessage({
        message: isEdited
          ? Messages.iconEditedSuccessfully
          : Messages.iconAddedSuccessfully,
        severity: Severity.Success,
      });
      loadGalleryItems();
      onCloseIconsDialog();
      setLoadingState(false);
    },
    [
      onMessage,
      onCloseIconsDialog,
      setLoadingState,
      loadGalleryItems,
      selectedIcon?.name,
    ]
  );

  const folderItems = useMemo(
    () =>
      (() => {
        const validItems = icons?.filter((icon) =>
          icon.name.toUpperCase().includes(filterValue.current.toUpperCase())
        );
        const noValidItemsMessage = (
          <Typography variant="body1">No results found</Typography>
        );
        const validComponents = validItems?.length
          ? validItems.map((item) => {
              const showIcon = item.name
                .toUpperCase()
                .includes(filterValue.current.toUpperCase());
              const isLoading = loadingIcons.find(
                (loadingIcons) => loadingIcons.path === item.path
              );
              return isLoading ? (
                <HiddenBoxStyled key={`${item.name}-${item.icon}loading`} />
              ) : (
                <GalleryItemCard
                  key={`${item.name}-${item.icon}`}
                  sx={showIcon ? undefined : { display: "none" }}
                  item={item}
                  onDelete={onClickItemDeleteIcon}
                  onEdit={onClickItemEditIcon}
                  onSuccessful={onSuccessfulCheckIconFont}
                />
              );
            })
          : [];
        const loadingComponents = loadingIcons?.length
          ? loadingIcons.map((item) => {
              return (
                <GalleryItemCard
                  key={`${item.name}-${item.icon}`}
                  item={item}
                  onDelete={onClickItemDeleteIcon}
                  onEdit={onClickItemEditIcon}
                  isLoading={true}
                  onSuccessful={onSuccessfulCheckIconFont}
                />
              );
            })
          : [];
        return validComponents?.length + loadingComponents?.length
          ? [...validComponents, ...loadingComponents]
          : noValidItemsMessage;
      })(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      filterValue?.current,
      icons,
      loadingIcons,
      onSuccessfulCheckIconFont,
      onClickItemDeleteIcon,
      onClickItemEditIcon,
    ]
  );

  return (
    <MainBoxStyled>
      <DeleteItemDialog
        itemName={itemNameToDelete}
        isOpen={isOpenDeleteItemDialog}
        onCancel={onCancelDeleteItemDialog}
        onConfirm={onConfirmDeleteItemDialog}
      />
      {isIconsDialogMount && (
        <IconsPanel
          key={`icons-${selectedIcon?.icon}-${selectedIcon?.name}`}
          icon={selectedIcon}
          mode={selectedIcon?.name ? Modes.Edit : Modes.Add}
          isOpen={isOpenIconsDialog}
          onExited={onExitedIconsDialog}
          onCloseDialog={onCloseIconsDialog}
          onSave={onSaveIcon}
        />
      )}

      <ContentBoxStyled>
        <CrudHeader
          label="Gallery"
          onClickItemAddMenu={isLoading ? undefined : onClickItemAddMenu}
        >
          <FilterBox
            value={filterBoxValue}
            error={filterWithError}
            onChange={handleChangeValue}
            onClear={handleClearValue}
          />
        </CrudHeader>

        <PaperStyled elevation={2}>
          {isLoading ? (
            <></>
          ) : (
            <List
              component="div"
              sx={{
                display: "flex",
                paddingTop: "1rem",
                gap: "1rem",
                padding: "0",
                flexWrap: "wrap",
              }}
            >
              {folderItems}
            </List>
          )}
        </PaperStyled>
      </ContentBoxStyled>
    </MainBoxStyled>
  );
};

export default Gallery;
