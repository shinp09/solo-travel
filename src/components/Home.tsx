import * as React from "react";
import style from "./Home.module.scss";

const Home: React.FC = () => {
  return (
    <div>
      <button className={style.btn}>プランを作成</button>
    </div>
  );
};

export default Home;
