import React, { useEffect, useState } from "react";
import style from "./Card.module.scss";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
// import CreateTask from "./CreateTask";
import TaskList from "./TaskList";
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
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [getPlansId, setGetPlansId] = useState("");

  // Homeからtitleが渡ってきたら、データベースにあるplanの中身を取得
  useEffect(() => {
    db.collection("plan").onSnapshot((snapshot) => {
      setPlans(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          contents: doc.data().contents,
        }))
      );
    });
  }, []);

  // Cardがクリックされたらmodalをtrueに変更
  // TasksModalWindowにpropsで渡す
  const modalOpen = (id: string) => {
    if (modal === false) {
      setModal(true);
      setGetPlansId(id);
    } else {
      setModal(false);
    }
  };

  return (
    <div className={style.conteiner}>
      <Wrap display="flex">
        <WrapItem cursor="pointer" flexWrap="wrap" justifyContent="flex-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={style.card}
              onClick={() => modalOpen(plan.id)}
            >
              <Box maxW="sm" borderWidth="2px" borderRadius="5">
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
              </Box>
            </div>
          ))}
        </WrapItem>
      </Wrap>
      <TaskList modal={modal} planId={getPlansId} />
    </div>
  );
};

export default Card;
