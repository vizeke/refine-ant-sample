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
import { dataProvider } from "rest-data-provider";
import { ProductList } from "pages/products/list";
import { ProductEdit } from "pages/products/edit";
import { ProductShow } from "pages/products/show";
import { ProductCreate } from "pages/products/create";
import authProvider from "authProvider";
import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  UpdatePasswordPage,
} from "components/pages/auth/components";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    // Retrieve the token from local storage
    const token = JSON.parse(localStorage.getItem("auth") || "");
    // Check if the header property exists
    if (request.headers) {
      // Set the Authorization header if it exists
      request.headers["Authorization"] = `Bearer ${token}`;
    } else {
      // Create the headers property if it does not exist
      request.headers = new AxiosHeaders();
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  }
);

function App() {
  return (
    <>
      <GitHubBanner />

      <Refine
        notificationProvider={notificationProvider}
        Layout={Layout}
        ReadyPage={ReadyPage}
        catchAll={<ErrorComponent />}
        routerProvider={{
          ...routerProvider,
          routes: [
            { path: "/login", element: <LoginPage /> },
            {
              path: "/register",
              element: <RegisterPage />,
            },
            {
              path: "/forgot-password",
              element: <ForgotPasswordPage />,
            },
            {
              path: "/update-password",
              element: <UpdatePasswordPage />,
            },
          ],
        }}
        dataProvider={dataProvider(
          "https://api.fake-rest.refine.dev",
          axiosInstance
        )}
        LoginPage={LoginPage}
        authProvider={authProvider}
        resources={[
          {
            name: "products",
            list: ProductList,
            show: ProductShow,
            create: ProductCreate,
            edit: ProductEdit,
            canDelete: true,
          },
        ]}
      />
    </>
  );
}

export default App;
