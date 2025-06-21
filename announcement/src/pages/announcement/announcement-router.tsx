import React from "react";
import { Provider } from "react-redux";
import { store } from "src/redux/store";
import RemoteRouter from "./RemoteRouter"; 

type RemoteRouterProps = {
  path: string;
};

export default function RemoteRouterWrapper(props: RemoteRouterProps) {
  return (
    <Provider store={store}>
      <RemoteRouter {...props} />
    </Provider>
  );
}
