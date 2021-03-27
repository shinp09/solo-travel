import React, { useEffect, useState, useContext } from "react";
import style from "./Card.module.scss";
import { db } from "../firebase";
import TaskList from "./TaskList";
import { Box, Wrap, WrapItem, Image } from "@chakra-ui/react";
import {
  MainModalContext,
  EditPlanIdContext,
  UserContext,
} from "./ContextProvider";
import firebase from "firebase/app";

const Card: React.FC = () => {
  const [plans, setPlans] = useState([
    {
      userName: "",
      id: "",
      title: "",
      contents: "",
      image: "",
      timestamp: "",
    },
  ]);
  const { mainModalState } = useContext(MainModalContext);
  const { editPlanIdState } = useContext(EditPlanIdContext);
  const { user } = useContext(UserContext);

  // ログインユーザーが作成したプランを取得、表示
  useEffect(() => {
    const loginUserData = firebase.auth().currentUser;
    const getPlan = db
      .collection("plan")
      .where("uid", "==", loginUserData?.uid)
      .onSnapshot((snapshot) => {
        setPlans(
          snapshot.docs.map((doc) => ({
            userName: doc.data().userName,
            id: doc.id,
            title: doc.data().title,
            contents: doc.data().contents,
            image: doc.data().image,
            timestamp: doc.data().timestamp,
          }))
        );
      });
    return () => {
      getPlan();
    };
  }, [user]);

  const modalOpen = (id: string) => {
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
              <Box maxW="260px" h="160px">
                <Image
                  width="100%"
                  height="160px"
                  src={plan.image}
                  alt=""
                  borderRadius="5"
                />
                <div className={style.underBox}>
                  <h2>{plan.title}</h2>
                </div>
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
