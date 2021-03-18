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
  Center,
} from "@chakra-ui/react";

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
    if (props.modal === true) {
      onOpen();
      const unSub = db
        .collection("plan")
        .doc(props.planId)
        .collection("task")
        .onSnapshot((snapshot) => {
          setGetPlansTask(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              tasksName: doc.data().task,
            }))
          );
          return () => unSub();
        });
    } else {
      setGetPlansTask([{ id: "", tasksName: "" }]);
    }
  }, [props.modal]);

  const createTask = () => {
    if (task) {
      setChangeModal(false);
      db.collection("plan")
        .doc(props.planId)
        .collection("task")
        .add({ task: task });
      setTask("");
      setChangeModal(true);
    } else if (task === "") {
      alert("タスクを入力してください");
    }
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
                    {getplansTask.map((task) => (
                      <Box
                        maxW="200px"
                        borderWidth="2px"
                        borderRadius="5"
                        bg="#eee8e8cc"
                        h="40px"
                        margin="5px"
                        p="6px"
                        fontSize="sm"
                        textAlign="center"
                        key={task.id}
                      >
                        {task.tasksName}
                      </Box>
                    ))}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="pink"
                      mr={4}
                      onClick={() => setChangeModal(false)}
                    >
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
                    <form>
                      <Button colorScheme="pink" mr={4} onClick={createTask}>
                        保存
                      </Button>
                    </form>
                    <Button onClick={() => setChangeModal(true)}>戻る</Button>
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
