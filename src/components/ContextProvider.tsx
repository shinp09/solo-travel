import React, { useState } from "react";

export const MainModalContext = React.createContext({
  mainModalOpen: () => {},
  mainModal: false,
});
export const subModalContext = React.createContext(false);

const ContextProvider: React.FC = (props) => {
  const [mainModal, setMainModal] = useState(false);

  const mainModalOpen = () => {
    setMainModal(true);
    console.log(mainModal);
  };

  return (
    <MainModalContext.Provider value={{ mainModalOpen, mainModal }}>
      {props.children}
    </MainModalContext.Provider>
  );
};

export default ContextProvider;
