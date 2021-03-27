import React, { useState, useContext } from "react";
import firebase from "firebase/app";
import { auth, db } from "../../firebase";
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
} from "@chakra-ui/react";

const AuthProvider: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isLogin, setIslogin] = useState(true);
  const [createUser, setCreateUser] = useState(false);
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
    if (email === "" || password === "") {
      alert("メールアドレスまたはパスワードを入力してください");
    } else {
      await auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection("user").doc("test").set({
            userName: userName,
            email: email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        })
        .then(() => {
          loginUserState(userName, email);
          setIslogin(true);
          setCreateUser(true);
        })
        .catch((err) => {
          alert(err.message);
        });
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

  return (
    <div className={style.container}>
      <ChakraProvider>
        {createUser && (
          <Alert status="success" className={style.createAcount}>
            <AlertIcon />
            アカウントが作成されました！
          </Alert>
        )}
        {createUser && (
          <Alert status="error" className={style.createAcount}>
            <AlertIcon />
            ログアウトされました！
          </Alert>
        )}
        {isLogin ? (
          <Flex width="full" align="center" justifyContent="center">
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
                    className={style.btn}
                    width="full"
                    color="white"
                    mt={10}
                    onClick={loginEmail}
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
                    className={style.btn}
                    color="white"
                    mt={10}
                    onClick={signUpEmail}
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
