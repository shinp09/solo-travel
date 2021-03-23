import React, { useState } from "react";

export const MainModalContext = React.createContext({
  mainModalState: () => {},
  mainModal: false,
});
export const SubModalContext = React.createContext({
  subModalState: () => {},
  subModal: false,
});

export const DeleteDialogContext = React.createContext({
  deleteDialogState: () => {},
  deleteDialog: false,
});

const ContextProvider: React.FC = (props) => {
  const [mainModal, setMainModal] = useState(false);
  const [subModal, setSubModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const mainModalState = () => {
    setMainModal(!mainModal);
  };

  const subModalState = () => {
    setSubModal(!subModal);
  };

  const deleteDialogState = () => {
    setDeleteDialog(!deleteDialog);
  };

  return (
    <>
      <MainModalContext.Provider value={{ mainModalState, mainModal }}>
        <SubModalContext.Provider value={{ subModalState, subModal }}>
          <DeleteDialogContext.Provider
            value={{ deleteDialogState, deleteDialog }}
          >
            {props.children}
          </DeleteDialogContext.Provider>
        </SubModalContext.Provider>
      </MainModalContext.Provider>
    </>
  );
};

export default ContextProvider;
