"use client";

import { createContext, ReactNode, useReducer } from "react";

interface PaperStore {
  // the height to render
  height?: string;
  // whether to activate CSS transition effects
  shouldTransition: boolean;
  // whether the last state (before this drage) was rolled up
  wasRolledUp?: boolean;
}

export const paperStoreInitialState = {
  height: undefined,
  shouldTransition: true,
  wasRolledUp: undefined,
};

type PaperStoreAction =
  | ({ type: "update" } & Partial<PaperStore>)
  | {
      type: "drag_height";
      dy: number;
    }
  | { type: "go_to_stop_point"; unrolledHeight: string; rolledHeight: string };

function reducer(state: PaperStore, action: PaperStoreAction) {
  if (action.type === "drag_height") {
    if (!state.height) return state;
    const newState = {
      ...state,
      height: `${Math.max(parseInt(state.height) + action.dy, 40)}px`,
    };
    console.log("reducer", action.type, action, newState);
    return newState;
  } else if (action.type === "go_to_stop_point") {
    const newState = {
      ...state,
      height: state.wasRolledUp ? action.unrolledHeight : action.rolledHeight,
      wasRolledUp: !state.wasRolledUp,
    };
    return newState;
  } else if (action.type === "update") {
    const newState = {
      ...state,
      ...action,
    };
    console.log("reducer", action.type, action, newState);
    return newState;
  } else {
    throw Error("Invalid action type");
  }
}

export const PaperStoreContext = createContext<{
  state: PaperStore;
  dispatch: React.Dispatch<PaperStoreAction>;
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
