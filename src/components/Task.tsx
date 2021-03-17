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
  // modal: boolean;
  planId: string;
}

const Task: React.FC<PROPS> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [task, setTask] = useState<string | number>("");

  console.log("テスト");

  const createTask = (e: React.FormEvent<HTMLFormElement>) => {
    onOpen();
    db.collection("plan")
      .doc(props.planId)
      .collection("task")
      .add({ task: task });
    setTask("");
  };

  return (
    <>
      <ChakraProvider>
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>タスクの作成</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <Input
                    placeholder="タスクの名前を入力してください"
                    onChange={(e) => setTask(e.target.value)}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <form onSubmit={createTask}>
                  <Button colorScheme="pink" mr={4}>
                    保存
                  </Button>
                </form>
                <Button onClick={onClose}>キャンセル</Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </ChakraProvider>
    </>
  );
};

export default Task;
