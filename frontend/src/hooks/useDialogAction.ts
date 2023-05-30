import { useCallback, useState } from "react";

type UseDialogAction = {
  initIsOpenDialog: boolean;
};
const useDialogAction = (
  { initIsOpenDialog = false }: UseDialogAction = {
    initIsOpenDialog: false,
  }
) => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(initIsOpenDialog);
  const [isDialogMount, setIsDialogMount] = useState<boolean>(initIsOpenDialog);

  const onCloseDialog = useCallback(() => {
    setIsOpenDialog(false);
  }, []);

  const onExitedDialog = useCallback(() => {
    setIsOpenDialog(false);
    setIsDialogMount(false);
  }, []);

  const onOpenDialog = useCallback(() => {
    setIsOpenDialog(true);
    setIsDialogMount(true);
  }, []);

  return {
    isOpenDialog,
    setIsOpenDialog,
    isDialogMount,
    setIsDialogMount,
    onCloseDialog,
    onExitedDialog,
    onOpenDialog,
  };
};

export default useDialogAction;
