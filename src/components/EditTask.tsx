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
  Text,
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
  const [editForm, setEditForm] = useState(false);
  const [editTaskImg, setEditTaskImg] = useState<File | null>(null);

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
      setEditForm(false);
    }
  };

  // taskの削除
  const deleteDialogStateChange = () => {
    setEditForm(false);
    deleteDialogState();
    subModalState();
  };

  const modalClose = () => {
    setEditForm(false);
    setChangeTask("");
    subModalState();
    onClose();
  };

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditTaskImg(e.target.files[0]);
    }
  };

  return (
    <div>
      {/* subModalがtrueの時に表示 */}
      {/* リファクタリング - 記述を減らせそう- */}
      {subModal && (
        <Modal isOpen={isOpen} onClose={modalClose} size="xl">
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>タスクの詳細</ModalHeader>
              <ModalBody pb={10}>
                <Text
                  textAlign="center"
                  fontWeight={700}
                  fontSize="xl"
                  letterSpacing={1}
                >
                  {props.task.taskName}
                </Text>
                <Image
                  src={props.task.taskImg}
                  my={10}
                  mx={"auto"}
                  w="400px"
                  h="300px"
                  textAlign={["center"]}
                />
                {editForm && (
                  <FormControl>
                    <Input
                      placeholder="変更内容を入力してください"
                      onChange={(e) => setChangeTask(e.target.value)}
                    />
                    {/* 画像の変更 */}
                    <input type="file" onChange={onChangeImageHandler} />
                  </FormControl>
                )}
              </ModalBody>
              <ModalFooter>
                {editForm ? (
                  <>
                    <Button mr={4} onClick={deleteDialogStateChange}>
                      削除
                      <DeleteDialog />
                    </Button>
                    <Button colorScheme="pink" mr={4} onClick={editNewTask}>
                      変更を保存
                    </Button>
                    <Button onClick={() => setEditForm(!editForm)}>戻る</Button>
                  </>
                ) : (
                  <>
                    <Button
                      colorScheme="pink"
                      mr={4}
                      onClick={() => setEditForm(!editForm)}
                    >
                      編集
                      <DeleteDialog />
                    </Button>
                    <Button onClick={modalClose}>戻る</Button>
                  </>
                )}
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      )}
    </div>
  );
};

export default EditTask;
