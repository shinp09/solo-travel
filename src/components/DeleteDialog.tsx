import React, { useContext, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  AlertDialogCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteDialogContext, MainModalContext } from "./ContextProvider";
import { db, storage } from "../firebase";

const DeleteDialog: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteDialogState, deleteDialog } = useContext(DeleteDialogContext);
  const { mainModalState, mainModal } = useContext(MainModalContext);

  useEffect(() => {
    deleteDialog && onOpen();
  }, [deleteDialog]);

  const closeDialog = () => {
    deleteDialogState();
    onClose();
  };

  //   planの削除
  //   planIDをグローバルな値にする
  const deletePlan = () => {
    // db.collection("plan").doc(props.planId).delete();
    // mainModalState();
    // onClose();
    alert("削除しました");
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
            <Button colorScheme="pink" ml={3} onClick={deletePlan} mr={4}>
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
