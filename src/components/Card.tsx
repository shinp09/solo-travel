import * as React from "react";
import style from "./Card.module.scss";

interface PROPS {
  title: string | number;
  contents: string | number | undefined;
}

const Card: React.FC<PROPS> = (props): JSX.Element => {
  return (
    <div className={style.card}>
      <p>{props.title}</p>
      <p>{props.contents}</p>
    </div>
  );
};

export default Card;
