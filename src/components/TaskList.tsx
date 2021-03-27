import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  ChakraProvider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  FormControl,
  Input,
  Text,
} from "@chakra-ui/react";
import style from "./TaskList.module.scss";
import EditTask from "./EditTask";
import {
  MainModalContext,
  SubModalContext,
  DeleteDialogContext,
  EditPlanIdContext,
} from "./ContextProvider";
import firebase from "firebase/app";
import { db, storage } from "../firebase";
import DeleteDialog from "./DeleteDialog";
import defaultImg from "./assets/default-img.png";

const TaskList: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [getPlansTask, setGetPlansTask] = useState([
    {
      id: "",
      tasksName: "",
      taskImg: "",
    },
  ]);
  const [clickPlansTask, setClickPlansTask] = useState({
    id: "",
    taskName: "",
    taskImg: "",
  });
  const [changeModal, setChangeModal] = useState<boolean>(true);
  const [task, setTask] = useState<string | number>("");
  const [taskImage, setTaskImage] = useState<File | null>(null);
  const { mainModalState, mainModal } = useContext(MainModalContext);
  const { subModalState } = useContext(SubModalContext);
  const { deleteDialogState } = useContext(DeleteDialogContext);
  const { editPlanId } = useContext(EditPlanIdContext);

  // mainModalの状態を監視
  useEffect(() => {
    if (mainModal === true) {
      onOpen();
      const unSub = db
        .collection("plan")
        .doc(editPlanId)
        .collection("task")
        .onSnapshot((snapshot) => {
          setGetPlansTask(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              tasksName: doc.data().name,
              taskImg: doc.data().image,
              index: doc.data().index,
            }))
          );
          return () => unSub();
        });
    } else {
      onClose();
      setGetPlansTask([{ id: "", tasksName: "", taskImg: "" }]);
    }
  }, [mainModal]);

  // taskの新規作成・画像保存
  const createTask = () => {
    // taskの新規作成・画像保存
    if (taskImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + taskImage.name;
      const uploadPlanImg = storage.ref(`images/${fileName}`).put(taskImage);
      //   onを使い、storageに何らかの処理があった場合の後処理を記述
      uploadPlanImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        // uploadの進捗を管理
        () => {},
        // errorのハンドリング
        (err) => {
          alert(err.message);
        },
        // 正常終了した場合にstorageの画像URLを取得し、作成されたプランをDBに保存
        async () => {
          await storage
            // 画像URLを取得
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db
                .collection("plan")
                .doc(editPlanId)
                .collection("task")
                .add({
                  name: task,
                  image: url,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
            });
        }
      );
    } else {
      db.collection("plan").doc(editPlanId).collection("task").add({
        name: task,
        image: defaultImg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setTask("");
    setTaskImage(null);
    setChangeModal(true);
  };

  // taskImageで追加された値を保存
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTaskImage(e.target.files[0]);
    }
  };

  const onClickEditTask = (index: number) => {
    subModalState();
    // 配列内からindex番号を取得し格納
    setClickPlansTask({
      id: getPlansTask[index].id,
      taskName: getPlansTask[index].tasksName,
      taskImg: getPlansTask[index].taskImg,
    });
  };

  // useCOntext内のdeleteDialogStateをtrueに変更
  const deleteDialogStateChange = () => {
    deleteDialogState();
    setClickPlansTask({
      id: "",
      taskName: "",
      taskImg: "",
    });
  };

  // modalを閉じる
  const closeModal = () => {
    onClose();
    mainModalState();
    if (changeModal === false) {
      setChangeModal(true);
    }
  };

  return (
    <div>
      <form>
        <ChakraProvider>
          {changeModal ? (
            <Modal isOpen={isOpen} onClose={closeModal} size="3xl">
              <ModalOverlay>
                <ModalContent>
                  <ModalHeader>タスク一覧</ModalHeader>
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
                      task={{
                        id: clickPlansTask.id,
                        taskName: clickPlansTask.taskName,
                        taskImg: clickPlansTask.taskImg,
                      }}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button mr={4} onClick={deleteDialogStateChange}>
                      プランを削除
                    </Button>
                    <DeleteDialog task={{ id: clickPlansTask.id }} />
                    <Button
                      colorScheme="pink"
                      mr={4}
                      onClick={() => setChangeModal(false)}
                    >
                      タスクを追加する
                    </Button>
                    <Button onClick={closeModal}>キャンセル</Button>
                  </ModalFooter>
                </ModalContent>
              </ModalOverlay>
            </Modal>
          ) : (
            <Modal isOpen={isOpen} onClose={closeModal} size="xl">
              <ModalOverlay>
                <ModalContent>
                  <ModalHeader>タスクの作成</ModalHeader>
                  <ModalBody pb={10}>
                    <FormControl>
                      <Input
                        placeholder="タスクの名前を入力してください"
                        onChange={(e) => setTask(e.target.value)}
                      />
                    </FormControl>
                    <label>
                      <input type="file" onChange={onChangeImageHandler} />
                    </label>
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
