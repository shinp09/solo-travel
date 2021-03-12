import React, { useEffect, useState } from "react";
import style from "./Card.module.scss";
import { db } from "../firebase";

// interface PROPS {
//   title: string | number;
//   contents: string | number | undefined;
// }

const Card: React.FC = (): JSX.Element => {
  const [plans, setPlans] = useState([{ id: "", title: "", contents: "" }]);

  // 現在は　再レンダリングされたら処理を行うから値が保存されたら処理を走らせる
  useEffect(() => {
    // データベースにあるtasksの中身を取得
    const unSub = db.collection("plan").onSnapshot((snapshot) => {
      setPlans(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          contents: doc.data().contents,
        }))
      );
    });
    // 再レンダリングされた時実行される関数
    return () => unSub();
  }, []);

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
