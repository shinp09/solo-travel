import React, { useState, useContext } from "react";
import style from "./Home.module.scss";
import "firebase/firestore";
import firebase from "firebase/app";
import Card from "./Card";
import { db, storage } from "../firebase";
import { UserContext } from "./ContextProvider";
import defaultImg from "./assets/default-img.png";
import { VscDeviceCamera } from "react-icons/vsc";
import {
  Button,
  ChakraProvider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Box,
  Text,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";

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
  const { user, logoutUserState } = useContext(UserContext);
  const [userAvatar, setUserAvatar] = useState<File | null>(null);

  // 入力されたデータをfirebaseに保存
  const sendPlan = () => {
    const loginUserData = firebase.auth().currentUser;
    // 画像がある場合storageに保存
    if (planImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + planImage.name;
      const uploadPlanImg = storage.ref(`images/${fileName}`).put(planImage);
      uploadPlanImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            // 画像URLを取得
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("plan").add({
                userName: user.userName,
                uid: loginUserData?.uid,
                title: posts.title,
                image: url,
                contents: posts.contents,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            });
        }
      );
    } else {
      db.collection("plan").add({
        uid: loginUserData?.uid,
        userName: user.userName,
        title: posts.title,
        image: defaultImg,
        contents: posts.contents,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setPosts({ title: "", contents: "" });
    setPlanImage(null);
    onClose();
  };

  // eventオブジェクトを通じて選択された画像をplanImageへ保存
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPlanImage(e.target.files[0]);
    }
  };

  return (
    <ChakraProvider>
      <div className={style.container}>
        {user && (
          <Popover>
            <PopoverTrigger>
              <Box w={200} background="#f7f7f7" borderRadius={50}>
                <Box
                  d="flex"
                  p={3}
                  _hover={{
                    cursor: "pointer",
                    opacity: "0.6",
                  }}
                  _focus={{
                    outline: "none",
                  }}
                >
                  {userAvatar ? (
                    <Avatar size="sm" src={defaultImg}></Avatar>
                  ) : (
                    <Avatar size="sm"></Avatar>
                  )}
                  <Text p={1} ml={3}>
                    {user.email}
                  </Text>
                </Box>
              </Box>
            </PopoverTrigger>
            <PopoverContent
              mx={10}
              w={100}
              _focus={{
                outline: "none",
              }}
            >
              <PopoverArrow />
              <PopoverBody
                fontSize={14}
                _hover={{
                  cursor: "pointer",
                  opacity: "0.6",
                }}
                onClick={logoutUserState}
              >
                ログアウト
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
        <h1>
          Planding a <span>solo</span> trip
        </h1>
        <Button
          color="white"
          background="#ff385c"
          d="block"
          outline="none"
          my={5}
          mx="auto"
          w={200}
          h={58}
          borderRadius={50}
          fontWeight={700}
          fontSize={16}
          _hover={{
            background: "#ff385c",
            opacity: "0.6",
          }}
          _focus={{
            outline: "none",
          }}
          onClick={onOpen}
        >
          プランを作成
        </Button>
        <form onSubmit={sendPlan}>
          <Modal isOpen={isOpen} onClose={onClose} size="5xl">
            <ModalOverlay>
              <ModalContent>
                <ModalHeader>プランを作成</ModalHeader>
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
                    <FormLabel mt={5}>概要</FormLabel>
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
                  <FormLabel mt={5}>画像</FormLabel>
                  <Input type="file" onChange={onChangeImageHandler} />
                </ModalBody>
                <ModalFooter>
                  <Button mr={4}>
                    <VscDeviceCamera />
                  </Button>
                  <Button
                    color="white"
                    background="#ff385c"
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
        </form>
        <div className={style.wrapper}>
          <Card />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default Home;
