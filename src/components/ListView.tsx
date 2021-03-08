import React, { useState } from "react";
import style from "./Home.module.scss";
import ReactModal from "react-modal";

const ListView: React.FC = (): JSX.Element => {
  const [modal, setModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string | number>("");

  const modalAction = () => {
    setModal(!modal);
  };

  const titleHolder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(title);
  };

  const handleClick = () => {
    setModal(!modal);
  };

  return (
    <div>
      <button className={style.btn} onClick={modalAction}>
        リストを作成
      </button>
      <ReactModal isOpen={modal} className={style.modal}>
        <form onSubmit={titleHolder}>
          <input
            placeholder="タイトルを入力してください"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </form>
        <button className={style.btn} onClick={handleClick}>
          作成
        </button>
        <button onClick={modalAction} className={style.secondaryBtn}>
          閉じる
        </button>
      </ReactModal>
    </div>
  );
};

export default ListView;
