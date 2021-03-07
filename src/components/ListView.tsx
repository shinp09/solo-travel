import React, { useState } from "react";
import style from "./Home.module.scss";
import ReactModal from "react-modal";

const ListView: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);

  const handleOpen = () => {
    setModal(true);
    console.log("true");
  };

  const handleClose = () => {
    setModal(false);
    console.log("false");
  };

  return (
    <div>
      <button className={style.btn} onClick={modal ? handleClose : handleOpen}>
        リストを作成
      </button>
      <ReactModal isOpen={modal} className={style.modal}>
        <button onClick={handleClose} className={style.btn}>
          閉じる
        </button>
      </ReactModal>
    </div>
  );
};

export default ListView;
