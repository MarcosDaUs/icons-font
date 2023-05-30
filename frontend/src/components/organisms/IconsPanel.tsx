import { useState, useContext, useCallback } from "react";
import {
  FormControl,
  FormHelperText,
  DialogActions,
  Typography,
  Button,
  Box,
  styled,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Controller, useForm } from "react-hook-form";
import { CreateIconRequest, Item, UpdateIconRequest } from "../../types/icon";
import { Modes } from "../../constants/crud";
import Messages from "../../constants/messages";
import { Severity } from "../../constants/snackbar";
import {
  applyRules,
  requiredRule,
  minLengthRule,
  maxLengthRule,
  onlyLettersOrNumbers,
  validOnlyLettersOrNumbersRegex,
} from "../../utils/formValidationRules";
import { LoadingContext } from "../../context/LoadingProvider";
import useUploadIconFile from "../../hooks/useUploadIconFile";
import DialogCard from "../molecules/DialogCard";
import InputText from "../atoms/ItemText";
import FileUploader from "../atoms/FileUploader";
import updateIcon from "../../services/updateIcon";
import { SnackBarContext } from "../../context/SnackBarProvider";
import CloudFrontIcon from "../atoms/CloudFrontIcon/CloudFrontIcon";

import styles from "./IconsPanel.module.css";
import createIcon from "../../services/createIcon";

const MainContentStyled = styled(Box)({
  display: "flex",
  flexGrow: "1",
  flexDirection: "column",
  marginBottom: "0.5rem",
  gap: "1rem",

  alignSelf: "center",
  justifySelf: "center",
});

const NameContainerStyled = styled(Box)({
  display: "flex",
  gap: "0.25rem",
  alignItems: "flex-end",
});

const InfoContainerStyled = styled(Box)({
  display: "flex",
  gap: "0.25rem",
  justifyContent: "flex-start",
  alignItems: "center",
});

const InfoIconStyled = styled(InfoIcon)(({ theme }) => ({
  size: "16px",
  fill: theme.palette.primary.main,
}));

interface formInterface {
  name: string;
  file?: File;
}

const FORM_DEFAULT_VALUES: formInterface = {
  name: "",
  file: undefined,
};

interface PropsPanelNotifications {
  mode: Modes;
  icon?: Item;
  isOpen: boolean;
  onExited: () => void;
  onCloseDialog: () => void;
  onSave: (icon: Item) => void;
}

const IconsPanel = ({
  icon,
  mode,
  isOpen,
  onExited,
  onCloseDialog,
  onSave,
}: PropsPanelNotifications) => {
  const nameMaxLength = 50;
  const [showNameInputInfo, setShowNameInputInfo] = useState(false);

  const { isLoading, setLoadingState } = useContext(LoadingContext);
  const { onMessage } = useContext(SnackBarContext);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<formInterface>({
    defaultValues:
      mode === Modes.Add
        ? FORM_DEFAULT_VALUES
        : {
            name: icon?.name || "",
            file: undefined,
          },
    shouldUnregister: true,
  });

  const { onFileUploaded, loadedFileName, svgString } = useUploadIconFile();

  const onSubmit = useCallback(
    (data: formInterface) => {
      setLoadingState(true);
      if (mode === Modes.Edit && icon === undefined) return;
      if (mode === Modes.Edit && icon !== undefined) {
        const updateBody: UpdateIconRequest = {
          name: data.name,
          file: data?.file || undefined,
          oldPath: icon?.path,
        };
        updateIcon(updateBody)
          .then((response) => {
            if (!response?.name) {
              onMessage({
                message: Messages.transactionFailed,
                severity: Severity.Error,
              });
              return;
            }
            onSave(response);
          })
          .catch((error) => {
            onMessage({
              message: error || Messages.transactionFailed,
              severity: Severity.Error,
            });
            onCloseDialog();
            setLoadingState(false);
          });
        return;
      }
      if (data.file === undefined) return;
      const postBody: CreateIconRequest = {
        name: data.name,
        file: data.file,
        folderPath: "",
      };
      createIcon(postBody)
        .then((response) => {
          if (!response?.name) {
            onMessage({
              message: Messages.transactionFailed,
              severity: Severity.Error,
            });
            return;
          }
          onSave(response);
        })
        .catch(() => {
          onMessage({
            message: Messages.transactionFailed,
            severity: Severity.Error,
          });
          onCloseDialog();
          setLoadingState(false);
        });
    },
    [mode, icon, setLoadingState, onCloseDialog, onMessage, onSave]
  );

  return (
    <DialogCard
      title={mode === Modes.Edit ? "Edit icon" : "Create a new icon"}
      open={isOpen}
      maxWidth="lg"
      sx={{
        "&.MuiDialog-root": {
          zIndex: "120",
        },
      }}
      TransitionProps={{
        onExited: onExited,
      }}
      MainContentProps={{
        sx: {
          gap: "1.75rem",
          marginTop: "0.625rem",
          minWidth: "700px",
        },
      }}
    >
      <MainContentStyled>
        <NameContainerStyled>
          <Controller
            name={"name"}
            control={control}
            rules={applyRules("Name", [
              requiredRule,
              onlyLettersOrNumbers,
              minLengthRule(3),
              maxLengthRule(nameMaxLength),
            ])}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputText
                id="icon-name"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                label="Name*"
                error={Boolean(errors?.name)}
                helperText={
                  errors?.name?.message ||
                  (showNameInputInfo ? (
                    <InfoContainerStyled>
                      <InfoIconStyled />
                      <Typography
                        variant="body2"
                        paddingTop="0.125rem"
                      >{`Name can have maximum ${nameMaxLength} characters`}</Typography>
                    </InfoContainerStyled>
                  ) : undefined)
                }
                disabled={false}
                onKeyPress={(event) => {
                  if (!validOnlyLettersOrNumbersRegex.test(event?.key || "")) {
                    event.preventDefault();
                  }
                }}
                onKeyDown={(event) => {
                  const prevValueLength =
                    (event.target as HTMLInputElement)?.value?.length || 0;
                  const isInvalid =
                    prevValueLength >= nameMaxLength &&
                    event.key !== "Backspace";
                  setShowNameInputInfo(isInvalid);
                }}
                sx={{
                  width: "70%",
                }}
                inputProps={{
                  maxLength: nameMaxLength.toString(),
                }}
              />
            )}
          />
        </NameContainerStyled>
        <Box
          sx={{
            display: "flex",
            flexGrow: "1",
          }}
        >
          <Controller
            name={"file"}
            control={control}
            rules={
              mode === Modes.Add
                ? applyRules("File", [requiredRule])
                : undefined
            }
            render={({ field: { onChange, value } }) => (
              <FormControl
                sx={{
                  flexGrow: "1",
                }}
              >
                <FileUploader
                  sx={{
                    flexGrow: "1",
                  }}
                  onFileUploaded={(file: File) =>
                    onFileUploaded(file, onChange)
                  }
                  isFileUploaded={Boolean(loadedFileName)}
                  fileUploadedName={loadedFileName}
                  disabled={false}
                />

                <FormHelperText
                  error={Boolean(errors?.file)}
                  sx={{
                    marginLeft: 0,
                    "&.Mui-error": {
                      color: "red",
                    },
                  }}
                >
                  {errors?.file?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "33.333333%",
            }}
          >
            <Typography variant="body1" paddingTop="0.25rem">
              File requirements:
            </Typography>
            <ul className=" text-fontMainColor text-sm list-disc list-inside">
              <li>Type: .SVG</li>
              <li>Icon pixels size: 128px</li>
            </ul>
          </Box>
          {mode === Modes.Edit && icon?.name && (
            <>
              <Box
                sx={{
                  borderStyle: "solid",
                  borderLeft: "1px",
                  marginRight: "12px",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "33.333333%",
                }}
              >
                <Typography variant="body1" paddingTop="0.25rem">
                  Current Icon:
                </Typography>
                <CloudFrontIcon
                  item={icon}
                  className={styles.iconsPanel__icon}
                />
              </Box>
            </>
          )}
          {!!svgString && (
            <>
              <Box
                sx={{
                  borderStyle: "solid",
                  borderLeft: "1px",
                  marginRight: "12px",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="body1" paddingTop="0.25rem">
                  File Preview:
                </Typography>
                <div
                  dangerouslySetInnerHTML={{
                    __html: svgString as string,
                  }}
                  className={`w-[50px] h-[50px] ml-5`}
                />
              </Box>
            </>
          )}
        </Box>

        <DialogActions className="p-0">
          <Button disabled={isLoading} onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
          <Button onClick={onCloseDialog}>Cancel</Button>
        </DialogActions>
      </MainContentStyled>
    </DialogCard>
  );
};

export default IconsPanel;
