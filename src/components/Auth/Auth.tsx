import React, { useState, useContext } from "react";
import "firebase/firestore";
import { auth, provider } from "../../firebase";
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
  const [isLogin, setIslogin] = useState(true);
  const [createUser, setCreateUser] = useState(false);
  const { loginUserState } = useContext(UserContext);
  const history = useHistory();

  // Emailでloginするための関数
  const loginEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
    history.push(`/`);
  };

  // バリデーションの強化
  const signUpEmail = async () => {
    await auth.createUserWithEmailAndPassword(email, password);
    setIslogin(true);
    setCreateUser(true);
    console.log("ok");
  };

  // ゲストログイン
  const guestLogin = async () => {
    const email = "guest@gmail.com";
    const password = "00000000000sA";
    await auth.signInWithEmailAndPassword(email, password);
    loginUserState(email, password);
    history.push(`/`);
  };

  return (
    <div className={style.container}>
      <ChakraProvider>
        {createUser ? (
          <Alert status="success" className={style.createAcount}>
            <AlertIcon />
            アカウントが作成されました！
          </Alert>
        ) : (
          ""
        )}
        {isLogin ? (
          <Flex width="full" align="center" justifyContent="center">
            <Box p={2}>
              <Box textAlign="center" m={10}>
                <Heading>Login</Heading>
              </Box>
              <Box my={4} textAlign="left">
                <form>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="test@test.com"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl mt={6}>
                    <FormLabel>Password</FormLabel>
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
                    mt={4}
                    onClick={loginEmail}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    width="full"
                    mt={4}
                    onClick={() => setIslogin(false)}
                  >
                    Signin
                  </Button>
                </form>
                <Button
                  variant="outline"
                  width="full"
                  mt={4}
                  onClick={guestLogin}
                >
                  Guest Login
                </Button>
              </Box>
            </Box>
          </Flex>
        ) : (
          <Flex width="full" align="center" justifyContent="center">
            <Box p={2}>
              <Box textAlign="center" m={10}>
                <Heading>Signin</Heading>
              </Box>
              <Box my={4} textAlign="left">
                <form>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="test@test.com"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl mt={6}>
                    <FormLabel>Password</FormLabel>
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
                    mt={4}
                    onClick={signUpEmail}
                  >
                    Signin
                  </Button>
                  <Button
                    variant="outline"
                    width="full"
                    mt={4}
                    onClick={() => setIslogin(true)}
                  >
                    Login
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
