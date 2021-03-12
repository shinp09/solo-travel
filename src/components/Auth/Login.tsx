import React, { useEffect, useState } from "react";
import "firebase/firestore";
import { auth, provider } from "../../firebase";
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

const Login = () => {
  return (
    <div className={style.container}>
      <ChakraProvider>
        <Flex width="full" align="center" justifyContent="center">
          <Box p={2}>
            <Box textAlign="center">
              <Heading>Login</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="test@test.com" />
                </FormControl>
                <FormControl mt={6}>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="*******" />
                </FormControl>
                <Button type="submit" variant="outline" width="full" mt={4}>
                  LogIn
                </Button>
                <Link to="/SignIn">
                  <Button type="submit" variant="outline" width="full" mt={4}>
                    Sign In
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

export default Login;
