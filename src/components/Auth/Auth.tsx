import React, { useState, useContext } from "react";
import firebase from "firebase/app";
import { auth, db, storage } from "../../firebase";
import { useHistory } from "react-router-dom";
import style from "./Auth.module.scss";
import { UserContext } from "../ContextProvider";
import {
  ChakraProvider,
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Avatar,
} from "@chakra-ui/react";
import { url } from "inspector";

const AuthProvider: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isLogin, setIslogin] = useState(true);
  const [createUser, setCreateUser] = useState(false);
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const { loginUserState } = useContext(UserContext);
  const history = useHistory();

  // Emailでloginするための関数
  const loginEmail = async () => {
    if (email === "" || password === "") {
      alert("メールアドレスまたはパスワードを入力してください");
    } else {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          const user = firebase.auth().currentUser;
          db.collection("user").doc(user?.uid).set({
            userName: userName,
            email: email,
          });
        })
        .then(() => {
          loginUserState(userName, email);
          history.push(`/`);
        })
        // errorメッセージの内容によってメッセージを変えたい
        .catch((err) => {
          alert(err.message);
        });
    }
  };

  // バリデーションの強化
  const signUpEmail = async () => {
    // バリデーション
    // 6桁の数字かつ2文字　|| 6文字+2数字ではなかった時にエラーを出す
    if (email === "" || password === "") {
      alert("メールアドレスまたはパスワードを入力してください");
    } else {
      // 画像がある場合storageに保存
      if (avatarImage) {
        const S =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const N = 16;
        const randomChar = Array.from(
          crypto.getRandomValues(new Uint32Array(N))
        )
          .map((n) => S[n % S.length])
          .join("");
        const fileName = randomChar + "_" + avatarImage.name;
        const uploadPlanImg = storage
          .ref(`images/${fileName}`)
          .put(avatarImage);
        uploadPlanImg.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {},
          (err) => {
            alert(err.message);
          },
          // 正常終了した場合にstorageの画像URLを取得し、作成されたプランをDBに保存
          async () => {
            auth.createUserWithEmailAndPassword(email, password);
            const loginUserData = firebase.auth().currentUser;
            await storage
              // 画像URLを取得
              .ref("images")
              .child(fileName)
              .getDownloadURL()
              .then(async (url) => {
                await db.collection("user").doc(loginUserData?.uid).set({
                  userName: userName,
                  uid: loginUserData?.uid,
                  avatarImage: url,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
                loginUserState(userName, email);
                setIslogin(true);
                setCreateUser(true);
              });
          }
        );
        // imageがない場合は、他情報のみDBに保存
      } else {
        const loginUserData = firebase.auth().currentUser;
        db.collection("user").doc(loginUserData?.uid).set({
          userName: userName,
          uid: loginUserData?.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        loginUserState(userName, email);
        setIslogin(true);
        setCreateUser(true);
      }
    }
  };

  // ゲストログイン
  // 非同期処理に書き換え
  const guestLogin = async () => {
    const userName = "ゲストユーザー";
    const email = "guest@gmail.com";
    const password = "00000000000sA";
    await auth.signInWithEmailAndPassword(email, password).then(() => {
      loginUserState(userName, email);
      history.push(`/`);
    });
  };

  // Avatar画像を保存
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatarImage(e.target.files[0]);
    }
  };

  return (
    <div className={style.container}>
      <ChakraProvider>
        {createUser && (
          <Alert status="success" className={style.createAcount}>
            <AlertIcon />
            アカウントが作成されました！
          </Alert>
        )}
        {isLogin ? (
          <Flex justifyContent="center">
            <Box p={2}>
              <Box textAlign="center" m={10}>
                <Heading fontSize="2xl">ログイン</Heading>
              </Box>
              <Box my={4} textAlign="left">
                <form>
                  <FormControl mt={5}>
                    <FormLabel fontSize="sm">メールアドレス</FormLabel>
                    <Input
                      type="email"
                      placeholder="test@test.com"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl mt={5}>
                    <FormLabel fontSize="sm">パスワード</FormLabel>
                    <Input
                      type="password"
                      placeholder="*******"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                    />
                  </FormControl>
                  <Button
                    variant="outline"
                    width="full"
                    color="white"
                    background="#ff385c"
                    mt={10}
                    onClick={loginEmail}
                    _hover={{
                      background: "#ff385c",
                      opacity: "0.6",
                    }}
                  >
                    ログイン
                  </Button>
                  <Button
                    variant="outline"
                    width="full"
                    mt={5}
                    onClick={() => setIslogin(false)}
                  >
                    アカウントを作成
                  </Button>
                </form>
                <Button width="full" mt={5} onClick={guestLogin}>
                  ゲストユーザーでログイン
                </Button>
              </Box>
            </Box>
          </Flex>
        ) : (
          <Flex width="full" align="center" justifyContent="center">
            <Box p={2}>
              <Box textAlign="center" m={10}>
                <Heading fontSize="2xl">アカウントの作成</Heading>
              </Box>
              <Box my={4} textAlign="left">
                <form>
                  <FormControl>
                    <FormLabel fontSize="sm">アカウント名</FormLabel>
                    <Input
                      type="name"
                      placeholder="username"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserName(e.target.value)
                      }
                    />
                  </FormControl>

                  {/* 画像の保存 START */}
                  <label>
                    <Box mt={5} textAlign="center">
                      {avatarImage ? (
                        <Avatar opacity="0.1" size="sm" />
                      ) : (
                        <>
                          <Avatar
                            size="sm"
                            _hover={{
                              cursor: "pointer",
                              opacity: "0.6",
                            }}
                          />

                          <Input
                            type="file"
                            onChange={onChangeImageHandler}
                            d="none"
                          />
                        </>
                      )}
                    </Box>
                  </label>
                  {/* 画像の保存 END */}

                  <FormControl mt={5}>
                    <FormLabel fontSize="sm">メールアドレス</FormLabel>
                    <Input
                      displey="none"
                      type="email"
                      placeholder="test@test.com"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl mt={5}>
                    <FormLabel fontSize="sm">パスワード</FormLabel>
                    <Input
                      type="password"
                      placeholder="*******"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                    />
                  </FormControl>
                  <Button
                    variant="outline"
                    width="full"
                    color="white"
                    background="#ff385c"
                    mt={10}
                    onClick={signUpEmail}
                    _hover={{
                      background: "#ff385c",
                      opacity: "0.6",
                    }}
                  >
                    作成
                  </Button>
                  <Button
                    variant="outline"
                    width="full"
                    mt={4}
                    onClick={() => setIslogin(true)}
                  >
                    ログインへ戻る
                  </Button>
                </form>
              </Box>
            </Box>
          </Flex>
        )}
      </ChakraProvider>
    </div>
  );
};

export default AuthProvider;
