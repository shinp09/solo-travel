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
  Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import style from "./TaskList.module.scss";
import EditTask from "./EditTask";

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
  const [editModal, setEditModal] = useState(false);

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
      setChangeModal(true);
    } else if (task === "") {
      alert("タスクを入力してください");
    }
  };

  const onClickEditTask = (index: number) => {
    setEditModal(true);
    db.collection("plan").doc(props.planId).update({ task: task });
  };

  const deleteTask = () => {
    alert("タスクを削除しました");
    setEditModal(false);
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
                  <ModalBody>
                    {getplansTask.map((task, index) => (
                      <Box
                        maxW="300px"
                        borderWidth="2px"
                        borderRadius="5"
                        bg="#eee8e8cc"
                        h="40px"
                        margin="5px 0"
                        textAlign="right"
                        key={task.id}
                        p={1.5}
                        onClick={(e) => onClickEditTask(index)}
                        className={style.box}
                      >
                        <Text fontSize="sm" textAlign="left">
                          {task.tasksName}
                        </Text>
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
                      <Button
                        colorScheme="pink"
                        mr={4}
                        onClick={() => createTask()}
                      >
                        保存
                      </Button>
                    </form>
                    <Button onClick={() => setChangeModal(true)}>戻る</Button>
                  </ModalFooter>
                </ModalContent>
              </ModalOverlay>
            </Modal>
          )}
          {editModal && (
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay>
                <ModalContent>
                  <ModalHeader>タスクの編集</ModalHeader>
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
                      <Button
                        colorScheme="gray"
                        mr={4}
                        onClick={() => deleteTask()}
                      >
                        <DeleteIcon />
                      </Button>
                      <Button colorScheme="pink" mr={4} onClick={createTask}>
                        保存
                      </Button>
                    </form>
                    <Button onClick={() => setEditModal(false)}>戻る</Button>
                  </ModalFooter>
                </ModalContent>
              </ModalOverlay>
            </Modal>
          )}
        </ChakraProvider>
        {/* <EditTask onClickEditTask={onClickEditTask} /> */}
      </form>
    </div>
  );
};

export default TaskList;
