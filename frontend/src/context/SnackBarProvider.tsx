import { AlertColor } from "@mui/material";
import React, { useCallback, useState } from "react";
import SnackBar, { SnackBarProps } from "../components/atoms/SnackBar";

type SnackBarConfig = { message: string } & Pick<
  SnackBarProps,
  "open" | "severity"
>;

type TonMessage = (params: { message: string; severity?: AlertColor }) => void;
interface ISnackBarContext {
  onClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
  onMessage: TonMessage;
  snackBarConfig: SnackBarConfig;
}

const INIT_SNACKBAR: SnackBarConfig = {
  open: false,
  message: "",
  severity: "info",
};

export const SnackBarContext = React.createContext<ISnackBarContext>({
  onClose: () => {},
  onMessage: () => {},
  snackBarConfig: INIT_SNACKBAR,
});

interface SnackBarProviderProps {
  children: React.ReactNode;
}

const SnackBarProvider = (props: SnackBarProviderProps) => {
  const { children } = props;
  const [snackBarConfig, setSnackBarConfig] = useState(INIT_SNACKBAR);
  const { open, message, severity } = snackBarConfig;

  const onClose = useCallback(
    (event: React.SyntheticEvent | Event, reason?: string) => {
      setSnackBarConfig((state) => ({ ...state, open: false }));
    },
    []
  );

  const onMessage: TonMessage = useCallback(({ message, severity }) => {
    setSnackBarConfig(
      () => ({ message, open: true, severity } as SnackBarConfig)
    );
  }, []);

  return (
    <SnackBarContext.Provider value={{ onClose, onMessage, snackBarConfig }}>
      <SnackBar
        open={open}
        message={message}
        severity={severity}
        onClose={onClose}
      />
      {children}
    </SnackBarContext.Provider>
  );
};

export default SnackBarProvider;
