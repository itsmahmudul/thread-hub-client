import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Authentication/Login";
import SignUp from "../Authentication/SignUp";
import Error from "../Pages/Error/error";
import Dashboard from "../Pages/Dashboard/Dashboard";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";

import PrivetRouts from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import MyProfile from "../Pages/Dashboard/MyProfile/MyProfile";
import AddPost from "../Pages/Dashboard/AddPost/AddPost";
import MyPost from "../Pages/Dashboard/MyPost/MyPost";
import Membership from "../Pages/Membership/Membership";
import PostDetails from "../Pages/Home/PostDetails";

import AdminProfile from "../Pages/AdminDashboard/Dash/AdminProfile";
import ManageUsers from "../Pages/AdminDashboard/Dash/ManageUsers";
import ReportedActivities from "../Pages/AdminDashboard/Dash/ReportedActivities";
import MakeAnnouncement from "../Pages/AdminDashboard/Dash/MakeAnnouncement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />
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
        element: <Login />
      },
      {
        path: "/signUp",
        element: <SignUp />
      },
      {
        path: "/post/:id",
        element: (
          <PrivetRouts>
            <PostDetails />
          </PrivetRouts>
        )
      }
    ]
  },

  // ✅ User Dashboard
  {
    path: "/dashboard",
    element: (
      <PrivetRouts>
        <Dashboard />
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
      }
    ]
  },

  // ✅ Admin Dashboard
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
    children: [
      {
        path: "admin-profile",
        element: <AdminProfile />
      },
      {
        path: "manage-users",
        element: <ManageUsers />
      },
      {
        path: "reported-activities",
        element: <ReportedActivities />
      },
      {
        path: "make-announcement",
        element: <MakeAnnouncement />
      }
    ]
  }
]);
