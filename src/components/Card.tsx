import React, { useEffect, useState, useContext } from "react";
import style from "./Card.module.scss";
import { db } from "../firebase";
import TaskList from "./TaskList";
import { Box, Wrap, WrapItem, Center, Image } from "@chakra-ui/react";
import { MainModalContext, EditPlanIdContext } from "./ContextProvider";

const Card: React.FC = () => {
  const [plans, setPlans] = useState([
    {
      id: "",
      title: "",
      contents: "",
      image: "",
      timestamp: "",
    },
  ]);
  const { mainModalState } = useContext(MainModalContext);
  const { editPlanIdState } = useContext(EditPlanIdContext);

  useEffect(() => {
    db.collection("plan").onSnapshot((snapshot) => {
      setPlans(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          contents: doc.data().contents,
          image: doc.data().image,
          timestamp: doc.data().timestamp,
        }))
      );
    });
  }, []);

  const modalOpen = async (id: string) => {
    mainModalState();
    editPlanIdState(id);
  };

  return (
    <div className={style.conteiner}>
      <Wrap display="inline-block">
        <WrapItem cursor="pointer" flexWrap="wrap" justifyContent="flex-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={style.card}
              onClick={() => modalOpen(plan.id)}
            >
              {/* <Box> */}
              <Box maxW="260px">
                <Image
                  width="100%"
                  height="160px"
                  src={plan.image}
                  alt=""
                  borderRadius="5"
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
      <TaskList />
    </div>
  );
};

export default Card;
