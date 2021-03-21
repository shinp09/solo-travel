import React, { useState, useEffect } from "react";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { db } from "../firebase";

interface PROPS {
  openEditTask: boolean;
  planId: string;
  task: {
    id: string;
    taskName: string;
  };
}

const EditTask: React.FC<PROPS> = (props) => {
  const [changeTask, setChangeTask] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (props.openEditTask === true) {
      onOpen();
    } else {
      // 閉じたらprops.openEditTaskの値をfalseにしたい
      onClose();
    }
  }, [props.openEditTask]);

  // 既存タスクを更新
  const editNewTask = () => {
    if (changeTask) {
      db.collection("plan")
        .doc(props.planId)
        .collection("task")
        .doc(props.task.id)
        .update({ task: changeTask });
      onClose();
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
    alert("削除しました");
  };

  const modalClose = () => {
    setChangeTask("");
    onClose();
  };
  return (
    <div>
      {/* propsで渡ってきたopenEditTaskがtrueの時に表示 */}
      {props.openEditTask && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>タスクの詳細</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={10}>
                {props.task.taskName}
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
