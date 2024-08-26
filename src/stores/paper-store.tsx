"use client";

import { createContext, ReactNode, useReducer } from "react";

interface PaperState {
  // the height to render
  height?: string;
  // whether to activate CSS transition effects
  shouldTransition: boolean;
  generators: Record<string, any>;
}

export const paperStoreInitialState = {
  height: undefined,
  shouldTransition: true,
  generators: {},
};

function reducer(state: PaperState, action: Partial<PaperState>) {
  return {
    ...state,
    ...action,
  };
}

export const PaperStoreContext = createContext<{
  state: PaperState;
  dispatch: React.Dispatch<Partial<PaperState>>;
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
