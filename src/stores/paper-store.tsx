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

type PaperStoreAction =
  | ({
      type: "update";
    } & Partial<PaperState>)
  | {
      type: "update_generator";
      generatorKey: string;
      size: "sm" | "md";
      generator: any;
    };

function reducer(state: PaperState, action: PaperStoreAction) {
  if (action.type === "update_generator") {
    const { generatorKey, size, generator } = action;
    return {
      ...state,
      generators: {
        ...state.generators,
        [generatorKey]: {
          ...state.generators[generatorKey],
          [size]: generator,
        },
      },
    };
  } else if (action.type === "update") {
    return {
      ...state,
      ...action,
    };
  } else {
    throw Error("unknown action type");
  }
}

export const PaperStoreContext = createContext<{
  state: PaperState;
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
