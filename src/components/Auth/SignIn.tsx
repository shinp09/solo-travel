import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChakraProvider,
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import style from "./Auth.module.scss";
import { auth } from "../../firebase";

const SignIn = () => {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState("");

  const handleClick = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  return (
    <div className={style.container}>
      <ChakraProvider>
        <Flex width="full" align="center" justifyContent="center">
          <Box p={2}>
            <Box textAlign="center">
              <Heading>SignIn</Heading>
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
                  type="button"
                  variant="outline"
                  width="full"
                  mt={4}
                  onClick={handleClick}
                >
                  Sign In
                </Button>
                <Link to="/Login">
                  <Button type="submit" variant="outline" width="full" mt={4}>
                    Log In
                  </Button>
                </Link>
              </form>
            </Box>
          </Box>
        </Flex>
      </ChakraProvider>
    </div>
  );
};

export default SignIn;
