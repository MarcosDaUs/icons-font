import {
  Dialog,
  DialogContent,
  Typography,
  DialogProps,
  DialogContentProps,
  Divider,
  styled,
  Box,
  TypographyProps,
  BoxProps,
  DividerProps,
} from "@mui/material";

const DialogContentStyled = styled(DialogContent)({
  padding: "44px 48px",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
});

const MainContentStyled = styled(Box)({
  display: "flex",
  marginTop: "10px",
  gap: "20px",
});

export interface DialogCardProps {
  title: string;
  DialogContentProps?: DialogContentProps;
  TitleProps?: Omit<TypographyProps, "component">;
  MainContentProps?: BoxProps;
  DividerProps?: DividerProps;
}

const DialogCard = (props: DialogProps & DialogCardProps) => {
  const {
    children,
    title,
    DialogContentProps = {},
    TitleProps = {},
    MainContentProps = {},
    DividerProps = {},
    ...rest
  } = props;

  return (
    <Dialog {...rest}>
      <DialogContentStyled {...DialogContentProps}>
        <Typography
          variant="h5"
          color="primary"
          fontWeight={500}
          {...TitleProps}
        >
          {title}
        </Typography>
        <Divider {...DividerProps} />

        <MainContentStyled {...MainContentProps}>{children}</MainContentStyled>
      </DialogContentStyled>
    </Dialog>
  );
};

export default DialogCard;
