import React, { useState, useEffect } from "react";
import style from "./Home.module.scss";
import "firebase/firestore";
import firebase from "firebase/app";
import { db, storage } from "../firebase";
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
import { GrCamera } from "react-icons/gr";
import Card from "./Card";

interface Contents {
  title: string | number;
  contents?: string | number;
}

const Home: React.FC = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posts, setPosts] = useState<Contents>({
    title: "",
    contents: "",
  });
  const [planImage, setPlanImage] = useState<File | null>(null);

  // 入力されたデータをfirebaseに保存
  const sendPlan = async () => {
    const docId = Math.random().toString(32).substring(2);
    const docRef = db.collection("plan").doc(docId);
    await docRef
      .set({
        title: posts.title,
        contents: posts.contents,
      })
      .then(function () {
        console.log("OK");
        onClose();
      })
      .catch(function (err) {
        console.log("error");
      });
    // }
    setPosts({ title: "", contents: "" });
    onClose;
  };

  // eventオブジェクトを通じて選択された画像をplanImageへ保存
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPlanImage(e.target.files[0]);
    }
  };

  return (
    <div className={style.container}>
      <h1>
        Planding a <span>solo</span> trip
      </h1>
      <button className={style.btn} onClick={onOpen}>
        プランを作成
      </button>
      <form onSubmit={sendPlan}>
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
                        setPosts({
                          ...posts,
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
                        setPosts({
                          ...posts,
                          contents: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <label>
                    <GrCamera />
                    <input type="file" onChange={onChangeImageHandler} />
                  </label>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="pink"
                    mr={4}
                    disabled={!posts}
                    onClick={sendPlan}
                  >
                    保存
                  </Button>
                  <Button onClick={onClose}>キャンセル</Button>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          </Modal>
        </ChakraProvider>
      </form>
      <div className={style.wrapper}>
        <Card />
      </div>
    </div>
  );
};

export default Home;
