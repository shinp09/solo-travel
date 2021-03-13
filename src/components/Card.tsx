import React, { useEffect, useState } from "react";
import style from "./Card.module.scss";
import { db } from "../firebase";

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
    <div className={style.card}>
      {plans.map((plan) => (
        <div key={plan.id}>
          <h2>{plan.title}</h2>
          <br />
          <h2>{plan.contents}</h2>
        </div>
      ))}
    </div>
  );
};

export default Card;
