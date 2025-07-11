import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Authentication/Login";
import SignUp from "../Authentication/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
        {
            path: '/',
            Component: Home
        },
        {
          path: '/login',
          Component: Login
        },
        {
          path: '/signUp',
          Component: SignUp
        }
    ]
  },
]);