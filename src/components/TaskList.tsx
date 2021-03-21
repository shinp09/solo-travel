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
import style from "./TaskList.module.scss";
import EditTask from "./EditTask";
import { DeleteIcon } from "@chakra-ui/icons";

interface PROPS {
  modal: boolean;
  planId: string;
}

const TaskList: React.FC<PROPS> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [getPlansTask, setGetPlansTask] = useState([
    {
      id: "",
      tasksName: "",
    },
  ]);
  const [changeModal, setChangeModal] = useState<boolean>(true);
  const [task, setTask] = useState<string | number>("");
  const [editModal, setEditModal] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);
  const [clickPlansTask, setClickPlansTask] = useState({
    id: "",
    taskName: "",
  });

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
              index: doc.data().index,
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

  // リファクタリング
  // 渡ってきたindexに該当する番号だけを表示したい
  const onClickEditTask = async (index: number) => {
    if (openEditTask === false) {
      setOpenEditTask(true);
      // 配列内からindex番号を取得し格納
      setClickPlansTask({
        id: getPlansTask[index].id,
        taskName: getPlansTask[index].tasksName,
      });
    } else {
      setOpenEditTask(false);
    }
  };

  // Planの削除
  const deletePlan = () => {
    db.collection("plan").doc(props.planId).delete();
    onClose();
    alert("削除しました");
  };

  return (
    <div>
      <form>
        <ChakraProvider>
          {changeModal ? (
            <Modal isOpen={isOpen} onClose={onClose} size="3xl">
              <ModalOverlay>
                <ModalContent>
                  <ModalHeader>タスク一覧</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody className={style.container}>
                    {getPlansTask.map((task, index) => (
                      <div key={task.id}>
                        <Box
                          w="300px"
                          h="40px"
                          borderWidth="2px"
                          borderRadius="5"
                          bg="#eee8e8cc"
                          textAlign="right"
                          onClick={() => onClickEditTask(index)}
                          className={style.box}
                        >
                          <Text fontSize="sm" textAlign="left">
                            {task.tasksName}
                          </Text>
                        </Box>
                      </div>
                    ))}
                    <EditTask
                      openEditTask={openEditTask}
                      planId={props.planId}
                      task={{
                        id: clickPlansTask.id,
                        taskName: clickPlansTask.taskName,
                      }}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button mr={4} onClick={deletePlan}>
                      プランを削除
                    </Button>
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
        </ChakraProvider>
      </form>
    </div>
  );
};

export default TaskList;
