import { IconButton, IconButtonProps, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  fontSize: "28px",
  padding: "0",
  "&:hover": {
    color: theme.palette.secondary.main,
  },
}));

const AddButton = (props: IconButtonProps) => {
  return (
    <IconButtonStyled {...props}>
      <AddIcon fontSize="inherit" />
    </IconButtonStyled>
  );
};

export default AddButton;
