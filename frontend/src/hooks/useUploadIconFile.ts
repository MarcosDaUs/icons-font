import { useState, useCallback, useContext } from "react";
import { Severity } from "../constants/snackbar";
import Messages from "../constants/messages";
import { checkSvgExtension } from "../utils/validationRules";
import { SnackBarContext } from "../context/SnackBarProvider";

const useUploadIconFile = () => {
  const validIconPxsSize = 128;
  const [loadedFileName, setLoadedFileName] = useState<string>();
  const [svgString, setSvgString] = useState<string | ArrayBuffer>();

  const { onMessage } = useContext(SnackBarContext);

  const onFileUploaded = useCallback(
    (file: File, onChange: (value: File) => void) => {
      if (!file) {
        onMessage({
          severity: Severity.Error,
          message: Messages.fileEmpty,
        });
        return;
      }

      const { name: fileName } = file;
      const isSvgFile = checkSvgExtension(fileName, file.type);

      if (!isSvgFile) {
        onMessage({
          severity: Severity.Error,
          message: Messages.noSvgFile,
        });
        return;
      }

      const readerAsText = new FileReader();
      const readerAsImage = new FileReader();

      readerAsText.onload = async (event) => {
        if (!event?.target?.result) {
          return;
        }

        const { result: fileContent } = event.target;

        if (!fileContent) {
          onMessage({
            severity: Severity.Error,
            message: Messages.fileEmpty,
          });
          return;
        }

        readerAsImage.onload = function (e) {
          let img = new Image();
          img.onload = function () {
            if (img.width === validIconPxsSize) {
              setLoadedFileName(fileName);
              setSvgString(fileContent);
              onChange(file);
              return;
            }
            onMessage({
              severity: Severity.Error,
              message: `The icon must have a width of ${validIconPxsSize}px, and it is of ${img.width}px`,
            });
          };
          img.src = readerAsImage.result as string;
        };

        readerAsImage.readAsDataURL(file);
      };

      readerAsText.readAsText(file);
    },
    [onMessage]
  );

  return {
    onFileUploaded,
    svgString,
    loadedFileName,
  };
};

export default useUploadIconFile;
