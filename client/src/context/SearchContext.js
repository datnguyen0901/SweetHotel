import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  city: undefined,
  dates: [],
  options: {
    adults: undefined,
    children: undefined,
    room: undefined,
  },
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      action.payload.dates.forEach((date) => {
        //plus 7 hours to match the date format in the database
        date.startDate.setHours(
          date.startDate.getHours() + 7
        );
        date.endDate.setHours(date.endDate.getHours() + 7);
      });
      localStorage.setItem(
        "search",
        JSON.stringify(action.payload)
      );
      return action.payload;
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    SearchReducer,
    INITIAL_STATE
  );

  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        dates: state.dates,
        options: state.options,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
