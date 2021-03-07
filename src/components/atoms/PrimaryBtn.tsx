import React from "react";
import style from "./Btn.module.scss";

type Props = {
  btn_text: string;
};

const PrimaryBtn: React.FC<Props> = (props) => {
  return (
    <div>
      <button className={style.btn}>{props.btn_text}</button>
    </div>
  );
};

export default PrimaryBtn;
