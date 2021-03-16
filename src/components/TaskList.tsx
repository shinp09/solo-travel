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

  return (
    <div>
      <form>
        <ChakraProvider>
          <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay>
              <ModalContent>
                <ModalHeader>タスク一覧</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
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
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="pink" mr={4}>
                    タスクを追加する
                  </Button>
                  <Button onClick={onClose}>キャンセル</Button>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          </Modal>
        </ChakraProvider>
      </form>
    </div>
  );
};

export default TaskList;
