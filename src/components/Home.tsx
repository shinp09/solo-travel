import React, { useState } from "react";
import style from "./Home.module.scss";
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
import Card from "./Card";

interface Contents {
  title: string | number;
  contents: string | number | undefined;
}

const Home: React.FC = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [planContents, setPlanContents] = useState<Contents>({
    title: "",
    contents: "",
  });

  return (
    <div className={style.container}>
      <h1>
        Plan a <span>solo</span> trip
      </h1>
      <button className={style.btn} onClick={onOpen}>
        プランを作成
      </button>
      <ChakraProvider>
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>カードの作成</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>名前</FormLabel>
                  <Input
                    placeholder="タイトル"
                    onChange={(e) =>
                      setPlanContents({
                        ...planContents,
                        title: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>概要</FormLabel>
                  <Input
                    placeholder="旅行内容を入力"
                    onChange={(e) =>
                      setPlanContents({
                        ...planContents,
                        contents: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="pink" mr={4}>
                  保存
                </Button>
                <Button onClick={onClose}>キャンセル</Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </ChakraProvider>
      <div className={style.wrapper}>
        <Card title={planContents.title} contents={planContents.contents} />
      </div>
    </div>
  );
};

export default Home;
