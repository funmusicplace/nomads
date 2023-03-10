import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ErrorPage from "./components/ErrorPage";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { GlobalStateProvider } from "./state/GlobalState";
import Profile from "./components/Profile";
import Manage from "./components/ManageArtist/Manage";
import { SnackBarContextProvider } from "state/SnackbarContext";
import { ThemeProvider } from "@emotion/react";
import { theme } from "utils/theme";
import Admin from "components/Admin/Admin";
import AdminUsers from "components/Admin/Users";
import AdminTrackGroups from "components/Admin/Trackgroups";
import AdminTracks from "components/Admin/Tracks";
import ManageArtist from "components/ManageArtist/ManageArtist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "manage",
        element: <Manage />,
      },
      { path: "manage/artists/:artistId", element: <ManageArtist /> },
      {
        path: "admin",
        element: <Admin />,
        children: [
          {
            path: "users",
            element: <AdminUsers />,
          },
          {
            path: "trackGroups",
            element: <AdminTrackGroups />,
          },
          {
            path: "tracks",
            element: <AdminTracks />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStateProvider>
        <SnackBarContextProvider>
          <RouterProvider router={router} />
        </SnackBarContextProvider>
      </GlobalStateProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
