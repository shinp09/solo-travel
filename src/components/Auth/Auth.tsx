import React, { useState } from "react";
import "firebase/firestore";
import { auth, provider } from "../../firebase";
import style from "./Auth.module.scss";
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

  // Emailでloginするための関数
  const loginEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  //   Googleアカウントでのログイン
  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((err) => alert(err.message));
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
    await auth.signInWithEmailAndPassword("guest@test.com", "00000000000");
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
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <FormControl mt={6}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="*******"
                      onChange={(e) => setPassword(e.target.value)}
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
              <Button onClick={signInGoogle}>SignIn with Google</Button>
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
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <FormControl mt={6}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="*******"
                      onChange={(e) => setPassword(e.target.value)}
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
