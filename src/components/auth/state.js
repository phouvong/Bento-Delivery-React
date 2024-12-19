export const loginInitialState = {
  status: "",
  activeLoginType: {
    otp: "",
    manual: "",
    social: "",
  },
};

export const loginReducer = (state, action) => {
  switch (action.type) {
    case "setStatus":
      return {
        ...state,
        status: action.payload,
      };
    case "setActiveLoginType":
      return {
        ...state,
        activeLoginType: {
          otp: action.payload.otp,
          manual: action.payload.manual,
          social: action.payload.social,
        },
      };
    default:
      return state;
  }
};

export const ACTIONS = {
  setStatus: "setStatus",
  setActiveLoginType: "setActiveLoginType",
};
