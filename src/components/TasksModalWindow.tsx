import React, { useEffect } from "react";
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

interface PROPS {
  // modalReset: () => void;
  modal: boolean;
}

const TasksModalWindow: React.FC<PROPS> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (props.modal === true) {
      onOpen();
    }
  }, [props.modal]);

  // 処理完了後modalの状態をfalseにする
  const modalReset = () => {
    onClose();
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
                    <Input placeholder="何する？" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>概要</FormLabel>
                    <Input placeholder="概要" />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="pink" mr={4}>
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
