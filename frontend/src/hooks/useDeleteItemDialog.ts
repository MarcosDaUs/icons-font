import { useState, useCallback } from "react";

interface UseDeleteItemDialog<T> {
  onCancelDialog?: () => void;
  onConfirmDialog?: (item?: T) => void;
}

const useDeleteItemDialog = <T>({
  onCancelDialog,
  onConfirmDialog,
}: UseDeleteItemDialog<T>) => {
  const [itemToDelete, setItemToDelete] = useState<T>();
  const [itemNameToDelete, setItemNameToDelete] = useState<string>("");
  const [isOpenDeleteItemDialog, setIsOpenDeleteItemDialog] =
    useState<boolean>(false);

  const showDeleteItemDialog = useCallback(
    (name: string, item?: T) => {
      setItemNameToDelete(name);
      setItemToDelete(item);
      setIsOpenDeleteItemDialog(true);
    },
    [setIsOpenDeleteItemDialog]
  );

  const closeDeleteItemDialog = useCallback(() => {
    setItemNameToDelete("");
    setItemToDelete(undefined);
    setIsOpenDeleteItemDialog(false);
  }, [setIsOpenDeleteItemDialog]);

  const onCancelDeleteItemDialog = useCallback(() => {
    closeDeleteItemDialog();
    if (onCancelDialog) onCancelDialog();
  }, [closeDeleteItemDialog, onCancelDialog]);

  const onConfirmDeleteItemDialog = useCallback(() => {
    closeDeleteItemDialog();
    if (onConfirmDialog) onConfirmDialog(itemToDelete);
  }, [itemToDelete, closeDeleteItemDialog, onConfirmDialog]);

  return {
    itemNameToDelete,
    isOpenDeleteItemDialog,
    showDeleteItemDialog,
    closeDeleteItemDialog,
    onCancelDeleteItemDialog,
    onConfirmDeleteItemDialog,
  };
};

export default useDeleteItemDialog;
