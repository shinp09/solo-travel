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
import { DeleteIcon } from "@chakra-ui/icons";
import { db } from "../firebase";
import { SubModalContext } from "./ContextProvider";
interface PROPS {
  planId: string;
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

  useEffect(() => {
    subModal ? onOpen() : onClose();
  }, [subModal]);

  // 既存タスクを更新
  const editNewTask = () => {
    if (changeTask) {
      db.collection("plan")
        .doc(props.planId)
        .collection("task")
        .doc(props.task.id)
        .update({ name: changeTask });
      onClose();
      subModalState();
    } else if (changeTask === "") {
      alert("タスクを入力してください");
    }
  };

  // taskの削除
  const deleteTask = () => {
    db.collection("plan")
      .doc(props.planId)
      .collection("task")
      .doc(props.task.id)
      .delete();
    onClose();
    subModalState();
    alert("削除しました");
  };

  const modalClose = () => {
    setChangeTask("");
    subModalState();
    onClose();
  };
  return (
    <div>
      {/* propsで渡ってきたopenEditTaskがtrueの時に表示 */}
      {subModal && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>タスクの詳細</ModalHeader>
              <ModalBody pb={10}>
                {props.task.taskName}
                <Image src={props.task.taskImg} m={5} w="400px" h="300px" />
                <FormControl>
                  <Input
                    placeholder="タスクの名前を入力してください"
                    onChange={(e) => setChangeTask(e.target.value)}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button mr={4} onClick={deleteTask}>
                  <DeleteIcon />
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
