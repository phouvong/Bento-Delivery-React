export const carCardInitialState = {
  open: false,
  openSameProvider: false,
  selectedTripType:""
};

export const carCardReducer = (state, action) => {
  switch (action.type) {
    case "setOpen":
      return {
        ...state,
        open: action.payload,
      };
    case "setOpenSameProvider":
      return {
        ...state,
        openSameProvider: action.payload,
      };
      case "setSelectedTripType":
        return {
          ...state,
          selectedTripType:action.payload
        }
    default:
      return state;
  }
};

export const ACTIONS = {
  setOpen: "setOpen",
  setOpenSameProvider: "setOpenSameProvider",
  setSelectedTripType:"setSelectedTripType"
};
