import TextField, { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  background: "white",
  "& .MuiFormLabel-root.Mui-focused": {
    color: theme.palette.primary.main,
  },
  "& .MuiFormLabel-root.Mui-error": {
    color: theme.palette.secondary.main,
  },
  "& .MuiFormLabel-root:not(.Mui-focused):not(.MuiFormLabel-filled)": {
    color: theme.palette.secondary.main,
  },
  "&  .MuiInputBase-input": {
    color: theme.palette.secondary.main,
  },
  "&  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: "2px",
    borderColor: theme.palette.secondary.main,
  },
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.secondary.main,
  },
  "& .MuiOutlinedInput-root:not(.Mui-focused ):hover .MuiOutlinedInput-notchedOutline":
    {
      borderColor: theme.palette.secondary.main,
    },
  "& .MuiOutlinedInput-root.MuiInputBase-root": {
    padding: 0,
  },
  "& .MuiInput-root.Mui-error:after": {
    borderBottomWidth: "2px",
    borderBottomColor: theme.palette.secondary.main,
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: theme.palette.secondary.main,
  },
}));

const InputText = (props: TextFieldProps) => {
  return (
    <>
      <StyledTextField
        type="text"
        variant="standard"
        autoComplete="off"
        {...props}
      />
    </>
  );
};

export default InputText;
