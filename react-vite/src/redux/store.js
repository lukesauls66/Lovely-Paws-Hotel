import { configureStore } from "@reduxjs/toolkit";
import { default as logger } from "redux-logger";
import sessionReducer from "./session";
import petsReducer from ".pets";

const store = configureStore({
  reducer: {
    session: sessionReducer,
    pets: petReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware();
    if (process.env.NODE_ENV === "development") {
      middlewares.push(logger);
    }
    return middlewares;
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
