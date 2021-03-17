import React, { useEffect, useState } from "react";
import { db } from "../firebase";
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
  ModalFooter,
  Box,
  FormControl,
  Input,
} from "@chakra-ui/react";
import Task from "./Task";

interface PROPS {
  modal: boolean;
  planId: string;
}

const TaskList: React.FC<PROPS> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [getplansTask, setGetPlansTask] = useState([
    {
      id: "",
      tasksName: "",
    },
  ]);
  const [changeModal, setChangeModal] = useState<boolean>(true);
  const [task, setTask] = useState<string | number>("");

  // 初回は値が反映されずモーダルが開く
  // モーダルを閉じて再度開くと値が取得できている
  useEffect(() => {
    taskGetFunction();
  }, [props.modal]);

  const taskGetFunction = () => {
    if (props.modal === true) {
      onOpen();
      const unSub = db.collection("plan").onSnapshot((snapshot) => {
        setGetPlansTask(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            tasksName: doc.data().tasksName,
          }))
        );
        return () => unSub();
      });
    } else {
      setGetPlansTask([{ id: "", tasksName: "" }]);
    }
  };

  const createTask = () => {
    setChangeModal(false);
    db.collection("plan")
      .doc(props.planId)
      .collection("task")
      .add({ task: task });
    setTask("");
  };

  return (
    <div>
      <form>
        <ChakraProvider>
          {changeModal ? (
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay>
                <ModalContent>
                  <ModalHeader>タスク一覧</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={400}>
                    <Box
                      maxW="sm"
                      borderWidth="2px"
                      borderRadius="5"
                      bg="#eee8e8cc"
                    >
                      {getplansTask.map((plan) => (
                        <div key={plan.id}>
                          <p>{plan.tasksName}</p>
                        </div>
                      ))}
                    </Box>
                    <Task planId={props.planId} />
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="pink" mr={4} onClick={createTask}>
                      タスクを追加する
                    </Button>
                    <Button onClick={onClose}>キャンセル</Button>
                  </ModalFooter>
                </ModalContent>
              </ModalOverlay>
            </Modal>
          ) : (
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay>
                <ModalContent>
                  <ModalHeader>タスクの作成</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={10}>
                    <FormControl>
                      <Input
                        placeholder="タスクの名前を入力してください"
                        onChange={(e) => setTask(e.target.value)}
                      />
                    </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <form onSubmit={createTask}>
                      <Button
                        colorScheme="pink"
                        mr={4}
                        onClick={() => setChangeModal(true)}
                      >
                        保存
                      </Button>
                    </form>
                    <Button onClick={() => setChangeModal(true)}>
                      キャンセル
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </ModalOverlay>
            </Modal>
          )}
        </ChakraProvider>
      </form>
    </div>
  );
};

export default TaskList;
