import React, { useState } from "react";

export const MainModalContext = React.createContext({
  mainModalState: () => {},
  mainModal: false,
});
export const SubModalContext = React.createContext({
  subModalState: () => {},
  subModal: false,
});

const ContextProvider: React.FC = (props) => {
  const [mainModal, setMainModal] = useState(false);
  const [subModal, setSubModal] = useState(false);

  const mainModalState = () => {
    setMainModal(!mainModal);
  };

  const subModalState = () => {
    setSubModal(!subModal);
  };

  return (
    <>
      <MainModalContext.Provider value={{ mainModalState, mainModal }}>
        <SubModalContext.Provider value={{ subModalState, subModal }}>
          {props.children}
        </SubModalContext.Provider>
      </MainModalContext.Provider>
    </>
  );
};

export default ContextProvider;
