import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Authentication/Login";
import SignUp from "../Authentication/SignUp";
import Error from "../Pages/Error/error";
import Dashboard from "../Pages/Dashboard/Dashboard";
import PrivetRouts from "./PrivateRoute";
import MyProfile from "../Pages/Dashboard/MyProfile/MyProfile";
import AddPost from "../Pages/Dashboard/AddPost/AddPost";
import MyPost from "../Pages/Dashboard/MyPost/MyPost";
import Membership from "../Pages/Membership/Membership";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <Error></Error>,
    children: [
      {
        path: '/',
        Component: Home
      },
      {
        path: '/membership',
        element: <PrivetRouts>
          <Membership />
        </PrivetRouts>
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
  {
    path: "/dashboard",
    element: <PrivetRouts>
      <Dashboard></Dashboard>
    </PrivetRouts>,
    children: [
      {
        path: "profile",
        element: <MyProfile />
      },
      {
        path: "add-post",
        element: <AddPost />
      },
      {
        path: "my-posts",
        element: <MyPost />
      }
    ]
  }
]);