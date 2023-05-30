import ClearIcon from "@mui/icons-material/Clear";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

const StyledFilterBox = styled(TextField)(({ theme }) => ({
  background: "white",
  "& .MuiFormLabel-root.Mui-focused": {
    color: theme.palette.primary.main,
  },
  "& .MuiFormLabel-root.Mui-error": {
    color: "#f32a4c",
  },
  "& .MuiFormLabel-root.Mui-error.Mui-focused": {
    color: "#f32a4c",
  },
  "& .MuiFormLabel-root:not(.Mui-focused):not(.MuiFormLabel-filled)": {
    transform: "translate(14px,9px) scale(1)",
    color: theme.palette.secondary.main,
  },
  "&  .MuiInputBase-input": {
    color: theme.palette.secondary.main,
    padding: "8.5px 14px",
  },
  "&  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: "2px",
    borderColor: theme.palette.secondary.main,
  },
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.secondary.main,
  },
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.secondary.main,
  },
  "& .MuiOutlinedInput-root:not(.Mui-focused ):hover .MuiOutlinedInput-notchedOutline":
    {
      borderColor: theme.palette.secondary.main,
    },
  "& .MuiOutlinedInput-root.MuiInputBase-root": {
    padding: "0",
  },
}));

const StyledClearIcon = styled(ClearIcon)({
  size: "12px",
});

interface AdornmentProps {
  onClick: () => void;
}

const Adornment = (props: AdornmentProps) => {
  const { onClick } = props;
  return (
    <InputAdornment position="end">
      <IconButton onClick={onClick}>
        <StyledClearIcon />
      </IconButton>
    </InputAdornment>
  );
};

type FilterBoxProps = TextFieldProps & {
  onClear: () => void;
};

const FilterBox = ({ onClear, ...rest }: FilterBoxProps) => {
  return (
    <StyledFilterBox
      label="Filter"
      type="text"
      variant="outlined"
      autoComplete="off"
      {...rest}
      InputProps={{ endAdornment: <Adornment onClick={onClear} /> }}
    />
  );
};

export default FilterBox;
