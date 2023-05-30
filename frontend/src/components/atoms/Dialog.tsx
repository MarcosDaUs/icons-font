import DialogMUI, { DialogProps as DialogPropsMUI } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { ReactNode } from "react";

interface DialogProps {
  children: ReactNode;
  Actions?: ReactNode;
  className?: string;
}

const Dialog = (props: DialogProps & DialogPropsMUI) => {
  const { Actions, children, sx, ...rest } = props;

  return (
    <DialogMUI
      maxWidth="sm"
      fullWidth={true}
      sx={{
        ...sx,
        display: "flex",
        flexDirection: "column",
        gap: "0",
      }}
      {...rest}
    >
      <DialogContent>
        {children}
        {Actions && <DialogActions>{Actions}</DialogActions>}
      </DialogContent>
    </DialogMUI>
  );
};

export default Dialog;
