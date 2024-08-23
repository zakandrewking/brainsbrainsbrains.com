"use client";

import { createContext, ReactNode, useReducer } from "react";

interface PaperStore {
  height?: string;
}

export const paperStoreInitialState = {
  height: undefined,
};

function reducer(state: PaperStore, action: Partial<PaperStore>) {
  const newState = {
    ...state,
    ...action,
  };
  return newState;
}

export const PaperStoreContext = createContext<{
  state: PaperStore;
  dispatch: React.Dispatch<Partial<PaperStore>>;
}>({
  state: paperStoreInitialState,
  dispatch: () => {
    throw Error("PaperStoreProvider not initialized");
  },
});

export const PaperStoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, paperStoreInitialState);
  return (
    <PaperStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </PaperStoreContext.Provider>
  );
};
