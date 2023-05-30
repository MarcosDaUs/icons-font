import Button from "@mui/material/Button";
import Dialog from "../atoms/Dialog";

interface DeleteItemDialogProps {
  itemName?: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteItemDialog = ({
  itemName = "",
  isOpen,
  onCancel,
  onConfirm,
}: DeleteItemDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      Actions={
        <>
          <Button onClick={onConfirm}>Delete</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </>
      }
    >
      Are you sure you want to delete &quot;{itemName}&quot; ?
    </Dialog>
  );
};

export default DeleteItemDialog;
