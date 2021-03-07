import * as React from "react";
import style from "./Home.module.scss";

const Home: React.FC = () => {
  const moduleWindow = () => {
    alert("test");
  };

  return (
    <div>
      <button className={style.btn} onClick={moduleWindow}>
        プランを作成する
      </button>
    </div>
  );
};

export default Home;
