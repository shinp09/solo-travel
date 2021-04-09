export type StateType = {
  id: string;
};

export type ActionType = {
  type: string;
  payload: string;
};

export const UserAuthReducer: any = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "setId":
      return {
        ...state,
        id: action.payload,
      };

    case "setOutId":
      return {
        ...state,
        id: null,
      };

    default:
      return {
        state,
      };
  }
};

export const initialState = { id: null };
