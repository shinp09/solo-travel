import React, { useState, useContext, useEffect } from "react";
import style from "./Home.module.scss";
import "firebase/firestore";
import firebase from "firebase/app";
import { db, storage } from "../firebase";
import { useHistory } from "react-router-dom";
import { UserContext } from "./ContextProvider";
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
} from "@chakra-ui/react";
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
  const { user, logoutUserState } = useContext(UserContext);
  const history = useHistory();

  // userの情報がなかった時はAuthに遷移
  // unmount時の処理を追加
  // useEffect(() => {
  //   if (user.email === "") {
  //     history.push(`/Auth`);
  //   }
  // }, [user]);

  // 入力されたデータをfirebaseに保存
  const sendPlan = () => {
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
              await db.collection("plan").add({
                userName: user.userName,
                title: posts.title,
                image: url,
                contents: posts.contents,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            });
        }
      );
      // imageがない場合は、他情報のみDBに保存
    } else {
      db.collection("plan").add({
        userName: user.userName,
        title: posts.title,
        image: "",
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
    <div className={style.container}>
      {user ? (
        <div>
          <h2>ログイン中 : {user.userName}</h2>
          <h2 onClick={logoutUserState}>ログアウト</h2>
        </div>
      ) : (
        ""
      )}
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
