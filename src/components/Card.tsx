import React, { useEffect, useState } from "react";
import style from "./Card.module.scss";
import { db } from "../firebase";
import TasksModalWindow from "./TasksModalWindow";
import { Box, Wrap, WrapItem, Center, Image } from "@chakra-ui/react";

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
  const [modal, setModal] = useState(false);

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

  // Cardがクリックされたらmodalをtrueに変更
  // TasksModalWindowにpropsで渡す
  const modalOpen = () => {
    if (modal === false) {
      setModal(true);
    } else {
      setModal(false);
    }
  };

  return (
    <div className={style.conteiner}>
      <Wrap display="flex">
        <WrapItem cursor="pointer" flexWrap="wrap" justifyContent="flex-start">
          {plans.map((plan) => (
            <div key={plan.id} className={style.card}>
              <Box
                maxW="sm"
                borderWidth="2px"
                borderRadius="5"
                onClick={modalOpen}
              >
                <Image
                  width="180px"
                  height="130px"
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
                <TasksModalWindow modal={modal} planId={plan.id} />
              </Box>
            </div>
          ))}
        </WrapItem>
      </Wrap>
    </div>
  );
};

export default Card;
