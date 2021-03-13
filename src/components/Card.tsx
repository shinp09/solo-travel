import React, { useEffect, useState } from "react";
import style from "./Card.module.scss";
import { db } from "../firebase";
import {
  Box,
  Wrap,
  WrapItem,
  Center,
  Image,
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

interface PROPS {
  title: string | number;
  contents?: string | number;
}

const Card: React.FC<PROPS> = (props) => {
  const [plans, setPlans] = useState([
    {
      id: "",
      title: "",
      contents: "",
    },
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Homeからtitleが渡ってきたら、データベースにあるplanの中身を取得
  useEffect(() => {
    const unSub = db.collection("plan").onSnapshot((snapshot) => {
      setPlans(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          contents: doc.data().contents,
        }))
      );
    });
    return () => unSub();
  }, [props.title]);

  return (
    <div className={style.conteiner}>
      <Wrap>
        <WrapItem onClick={onOpen} cursor="pointer">
          {plans.map((plan) => (
            <div key={plan.id} className={style.card}>
              <Box maxW="sm" borderWidth="1px" borderRadius="xl">
                <Image
                  width="200px"
                  height="150px"
                  src="https://bit.ly/2Z4KKcF"
                  alt="Rear view of modern home with pool"
                  p="10px"
                />
                <Center w="100%" h="30px">
                  <h2>{plan.title}</h2>
                </Center>
                <Center w="100%" h="30px">
                  <h2>{plan.contents}</h2>
                </Center>
              </Box>
            </div>
          ))}
        </WrapItem>
      </Wrap>
    </div>
  );
};

export default Card;
