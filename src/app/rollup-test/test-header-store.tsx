"use client";

import { createContext, ReactNode, useReducer } from "react";

export const rolledHeight = 180;
export const unrolledHeight = 1300;

interface State {
  // the height to render
  height?: string;
  // whether to activate CSS transition effects
  shouldTransition: boolean;
}

function reducer(state: State, action: Partial<State>) {
  return {
    ...state,
    ...action,
  };
}

const initialState = {
  height: `${rolledHeight}px`,
  shouldTransition: true,
};

export const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Partial<State>>;
}>({
  state: initialState,
  dispatch: () => {
    throw Error("PaperStoreProvider not initialized");
  },
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
