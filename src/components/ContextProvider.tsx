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

export const UserContext = React.createContext({
  loginUserState: (userName: string, email: string) => {},
  logoutUserState: () => {},
  user: {
    userName: "",
    email: "",
  },
});

// export const UserAuthContext = React.createContext(
//   {} as {
//     state: any;
//     dispatch: React.Dispatch<React.SetStateAction<any>>;
//   }
// );

const ContextProvider: React.FC = (props) => {
  const [mainModal, setMainModal] = useState(false);
  const [subModal, setSubModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editPlanId, setEditPlanId] = useState("");
  const [user, setUser] = useState({
    userName: "",
    email: "",
  });

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

  // login状態を保存
  const loginUserState = (userName: string, email: string) => {
    setUser({
      userName: userName,
      email: email,
    });
  };

  const logoutUserState = () => {
    setUser({
      userName: "",
      email: "",
    });
  };

  return (
    <>
      <MainModalContext.Provider value={{ mainModalState, mainModal }}>
        <SubModalContext.Provider value={{ subModalState, subModal }}>
          <DeleteDialogContext.Provider
            value={{ deleteDialogState, deleteDialog }}
          >
            <EditPlanIdContext.Provider value={{ editPlanIdState, editPlanId }}>
              <UserContext.Provider
                value={{ loginUserState, user, logoutUserState }}
              >
                {props.children}
              </UserContext.Provider>
            </EditPlanIdContext.Provider>
          </DeleteDialogContext.Provider>
        </SubModalContext.Provider>
      </MainModalContext.Provider>
    </>
  );
};

export default ContextProvider;
