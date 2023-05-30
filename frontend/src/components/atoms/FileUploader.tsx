import { useState } from "react";
import { Button, ButtonProps, styled } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const ButtonFileUploader = styled((props) => (
  <Button variant="outlined" component="label" {...props} />
))<ButtonProps>(({ theme }) => ({
  justifySelf: "stretch",
  alignSelf: "strech",
  borderStyle: "dashed",
  borderWidth: "3px",

  "&:hover": {
    borderStyle: "dashed",
    borderWidth: "3px",
  },
}));

interface FileUploaderProps {
  onFileUploaded: (file: File) => void;
  isFileUploaded: boolean;
  fileUploadedName?: string;
}

const FileUploader = ({
  isFileUploaded = false,
  fileUploadedName = "",
  onFileUploaded,
  sx,
  ...buttonProps
}: ButtonProps & FileUploaderProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setIsDragActive(true);
    } else if (event.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onFileUploaded(event.dataTransfer.files[0]);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    onFileUploaded(file);
  };

  const onClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const element = event.target as HTMLInputElement;
    element.value = "";
  };

  return (
    <ButtonFileUploader
      startIcon={<FileUploadIcon />}
      onDrop={handleDrop}
      onDragOver={handleDrag}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      sx={{
        ...{
          background: isDragActive ? "rgba(115, 86, 121, 0.2)" : "white",
        },
        ...sx,
      }}
      {...buttonProps}
    >
      {isFileUploaded
        ? `File uploaded: ${fileUploadedName}`
        : "Drag file or click to upload"}

      <input
        type="file"
        accept=".svg"
        hidden
        onChange={onChange}
        onClick={onClick}
      />
    </ButtonFileUploader>
  );
};

export default FileUploader;
