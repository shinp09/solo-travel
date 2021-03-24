import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  Input,
  Image,
} from "@chakra-ui/react";
import { db } from "../firebase";
import {
  SubModalContext,
  DeleteDialogContext,
  EditPlanIdContext,
} from "./ContextProvider";
import DeleteDialog from "./DeleteDialog";

interface PROPS {
  task: {
    id: string;
    taskName: string;
    taskImg: string;
  };
}

const EditTask: React.FC<PROPS> = (props) => {
  const [changeTask, setChangeTask] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { subModalState, subModal } = useContext(SubModalContext);
  const { deleteDialogState } = useContext(DeleteDialogContext);
  const { editPlanId } = useContext(EditPlanIdContext);

  useEffect(() => {
    subModal ? onOpen() : onClose();
  }, [subModal]);

  // 既存タスクを更新
  const editNewTask = () => {
    if (changeTask === "") {
      alert("変更内容を入力してください");
    } else {
      db.collection("plan")
        .doc(editPlanId)
        .collection("task")
        .doc(props.task.id)
        .update({ name: changeTask });
      onClose();
      subModalState();
    }
  };

  // taskの削除
  const deleteDialogStateChange = () => {
    deleteDialogState();
    subModalState();
  };

  const modalClose = () => {
    setChangeTask("");
    subModalState();
    onClose();
  };
  return (
    <div>
      {/* subModalがtrueの時に表示 */}
      {subModal && (
        <Modal isOpen={isOpen} onClose={modalClose} size="xl">
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>タスクの詳細</ModalHeader>
              <ModalBody pb={10}>
                {props.task.taskName}
                <Image src={props.task.taskImg} m={5} w="400px" h="300px" />
                <FormControl>
                  <Input
                    placeholder="変更内容を入力してください"
                    onChange={(e) => setChangeTask(e.target.value)}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button mr={4} onClick={deleteDialogStateChange}>
                  タスクを削除
                  <DeleteDialog />
                </Button>
                <Button colorScheme="pink" mr={4} onClick={editNewTask}>
                  変更を保存
                </Button>
                <Button onClick={modalClose}>戻る</Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      )}
    </div>
  );
};

export default EditTask;
