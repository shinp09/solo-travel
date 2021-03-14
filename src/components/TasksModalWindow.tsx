import React, { useEffect, useState } from "react";
import {
  Button,
  ChakraProvider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
} from "@chakra-ui/react";
import { db } from "../firebase";

interface PROPS {
  modal: boolean;
  planId: string;
}

const TasksModalWindow: React.FC<PROPS> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tasks, setTasks] = useState({
    taskName: "",
    taskContents: "",
  });

  // console.log(props.titleId[0]);

  useEffect(() => {
    if (props.modal === true) {
      onOpen();
    }
  }, [props.modal]);

  // 処理完了後modalの状態をfalseにする
  const modalReset = () => {
    onClose();
  };

  const sendTask = async () => {
    if (props.planId) {
      console.log(tasks);
      const docRef = db.collection("plan").doc(props.planId);
      await docRef
        .update({
          tasksName: tasks.taskName,
          taskContents: tasks.taskContents,
        })
        .then(function () {
          onClose();
        })
        .catch(function (err) {
          console.log("error");
        });
    }
    setTasks({ taskName: "", taskContents: "" });
  };

  return (
    <div>
      <form>
        <ChakraProvider>
          <Modal isOpen={isOpen} onClose={onClose} size="5xl">
            <ModalOverlay>
              <ModalContent>
                <ModalHeader>タスクの追加</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>何する？</FormLabel>
                    <Input
                      placeholder="何する？"
                      onChange={(e) =>
                        setTasks({ ...tasks, taskName: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>概要</FormLabel>
                    <Input
                      placeholder="概要"
                      onChange={(e) =>
                        setTasks({ ...tasks, taskContents: e.target.value })
                      }
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="pink" mr={4} onClick={sendTask}>
                    保存
                  </Button>
                  <Button onClick={modalReset}>キャンセル</Button>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          </Modal>
        </ChakraProvider>
      </form>
    </div>
  );
};

export default TasksModalWindow;
