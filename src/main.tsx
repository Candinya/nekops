import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./layout.tsx";

import store from "@/store.ts";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Layout />
    </Provider>
  </React.StrictMode>,
);
