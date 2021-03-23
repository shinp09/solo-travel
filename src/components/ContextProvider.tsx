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

export const EditPlanIdContext = React.createContext({
  editPlanIdState: (id: string) => {},
  editPlanId: "",
});

const ContextProvider: React.FC = (props) => {
  const [mainModal, setMainModal] = useState(false);
  const [subModal, setSubModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editPlanId, setEditPlanId] = useState("");

  const mainModalState = () => {
    setMainModal(!mainModal);
  };

  const subModalState = () => {
    setSubModal(!subModal);
  };

  const deleteDialogState = () => {
    setDeleteDialog(!deleteDialog);
  };

  const editPlanIdState = (id: string) => {
    setEditPlanId(id);
  };

  return (
    <>
      <MainModalContext.Provider value={{ mainModalState, mainModal }}>
        <SubModalContext.Provider value={{ subModalState, subModal }}>
          <DeleteDialogContext.Provider
            value={{ deleteDialogState, deleteDialog }}
          >
            <EditPlanIdContext.Provider value={{ editPlanIdState, editPlanId }}>
              {props.children}
            </EditPlanIdContext.Provider>
          </DeleteDialogContext.Provider>
        </SubModalContext.Provider>
      </MainModalContext.Provider>
    </>
  );
};

export default ContextProvider;
