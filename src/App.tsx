import React from "react";

import { Refine, GitHubBanner } from "@pankod/refine-core";
import {
  notificationProvider,
  Layout,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-antd";
import "@pankod/refine-antd/dist/reset.css";

import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "@pankod/refine-simple-rest";

function App() {
  return (
    <>
      <GitHubBanner />

      <Refine
        notificationProvider={notificationProvider}
        Layout={Layout}
        ReadyPage={ReadyPage}
        catchAll={<ErrorComponent />}
        routerProvider={routerProvider}
        dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
      />
    </>
  );
}

export default App;
