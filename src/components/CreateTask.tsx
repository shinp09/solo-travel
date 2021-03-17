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
  ModalFooter,
  Box,
} from "@chakra-ui/react";
import { db } from "../firebase";

interface PROPS {
  modal: boolean;
}

const CreateTask: React.FC<PROPS> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log("テスト");

  // const taskGetFunction = () => {
  //   if (props.modal === true) {
  //     onOpen();
  //     const unSub = db.collection("plan").onSnapshot((snapshot) => {
  //       setGetPlansTask(
  //         snapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           tasksName: doc.data().tasksName,
  //         }))
  //       );
  //       return () => unSub();
  //     });
  //   } else {
  //     setGetPlansTask([{ id: "", tasksName: "" }]);
  //   }
  // };

  return (
    <>
      <ChakraProvider>
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>タスク新規作成</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={400}>
                <Box
                  maxW="sm"
                  borderWidth="2px"
                  borderRadius="5"
                  bg="#eee8e8cc"
                >
                  <h2>テスト</h2>
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="pink" mr={4}>
                  作成
                </Button>
                <Button onClick={onClose}>キャンセル</Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </ChakraProvider>
    </>
  );
};

export default CreateTask;
