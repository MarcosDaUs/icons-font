import React from "react";
import { Alert, AlertColor, AlertProps } from "@mui/material";
import SnackbarMUI, {
  SnackbarProps as SnackbarPropsMUI,
} from "@mui/material/Snackbar";

export type SnackMessages = {
  [name: string]: {
    message: string;
    severity?: AlertColor;
  };
};

export type SnackBarProps = Omit<SnackbarPropsMUI, "onClose"> & {
  onClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
} & Pick<AlertProps, "severity">;

const SnackBar = ({
  open,
  onClose,
  message,
  anchorOrigin = { vertical: "top", horizontal: "right" },
  autoHideDuration = 5000,
  severity = "info",
  ...rest
}: SnackBarProps) => {
  return (
    <>
      <SnackbarMUI
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={anchorOrigin}
        {...rest}
      >
        <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </SnackbarMUI>
    </>
  );
};

export default SnackBar;
