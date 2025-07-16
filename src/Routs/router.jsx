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
import PostDetails from "../Pages/Home/PostDetails";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";
import AdminProfile from "../Pages/AdminDashboard/Dash/AdminProfile";
import ManageUsers from "../Pages/AdminDashboard/Dash/ManageUsers";
import ReportedActivities from "../Pages/AdminDashboard/Dash/ReportedActivities";
import MakeAnnouncement from "../Pages/AdminDashboard/Dash/MakeAnnouncement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        Component: Home
      },
      {
        path: "/membership",
        element: (
          <PrivetRouts>
            <Membership />
          </PrivetRouts>
        )
      },
      {
        path: "/login",
        Component: Login
      },
      {
        path: "/signUp",
        Component: SignUp
      },
      {
        path: "/post/:id",
        element: <PrivetRouts>
          <PostDetails />
        </PrivetRouts>
      }
    ]
  },
  {
    path: "/dashboard",
    element: (
      <PrivetRouts>
        <Dashboard></Dashboard>
      </PrivetRouts>
    ),
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
      },
      {
        path: "admin",
        element: <AdminRoute>
          <AdminDashboard />
        </AdminRoute>,
        children: [
          {
            index: true,
            element: <AdminProfile></AdminProfile>
          },
          {
            path: "manage-users",
            element: <ManageUsers></ManageUsers>
          },
          {
            path: "reported-activities",
            element: <ReportedActivities></ReportedActivities>
          },
          {
            path: "make-announcement",
            element: <MakeAnnouncement></MakeAnnouncement>
          }
        ]
      }
    ]
  }
]);
