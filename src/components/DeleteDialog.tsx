import React, { useContext, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import {
  DeleteDialogContext,
  MainModalContext,
  EditPlanIdContext,
} from "./ContextProvider";
import { db } from "../firebase";

interface PROPS {
  task?: {
    id: string;
  };
}

const DeleteDialog: React.FC<PROPS> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteDialogState, deleteDialog } = useContext(DeleteDialogContext);
  const { mainModalState } = useContext(MainModalContext);
  const { editPlanId } = useContext(EditPlanIdContext);

  useEffect(() => {
    deleteDialog ? onOpen() : onClose();
  }, [deleteDialog]);

  const closeDialog = () => {
    deleteDialogState();
    onClose();
  };

  //   planの削除
  //   planIDをグローバルな値にする
  const deletePlan = () => {
    if (props.task?.id) {
      db.collection("plan")
        .doc(editPlanId)
        .collection("task")
        .doc(props.task?.id)
        .delete();
      onClose();
      deleteDialogState();
    } else {
      db.collection("plan").doc(editPlanId).delete();
      deleteDialogState();
      mainModalState();
      onClose();
    }
  };

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={undefined}
        onClose={closeDialog}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>削除しますか?</AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              color="white"
              background="#ff385c"
              ml={3}
              onClick={deletePlan}
              mr={4}
            >
              削除
            </Button>
            <Button onClick={closeDialog}>キャンセル</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteDialog;
