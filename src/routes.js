import React from "react";
import { AppRoutes } from "./Config";

const Dashboard = React.lazy(() => import("./views/Dashboard/Dashboard"));
const MyProfile = React.lazy(() => import("./views/MyProfile/MyProfile"));

const Setting = React.lazy(() => import("./views/Settings"));

const Users = React.lazy(() => import("./views/Users"));
const Projects = React.lazy(() => import("./views/project/project"));
const Donations = React.lazy(() => import("./views/DonationsViaPaypal"));
const MonthlyDonations = React.lazy(() => import("./views/MonthlyDonations"));
const Comments = React.lazy(() => import("./views/Comments/comments"));
const ContacusList = React.lazy(() => import('./views/Contactus'))

const routes = [
  { path: AppRoutes.MAIN, exact: true, name: "Home" },
  {
    path: AppRoutes.HOME,
    name: "Dashboard",
    component: Dashboard,
    exact: true
  },
  {
    path: AppRoutes.MY_PROFILE,
    exact: true,
    name: "My Profile",
    component: MyProfile
  },
  {
    path: AppRoutes.SETTINGS,
    exact: true,
    name: "Settings",
    component: Setting
  },
  {
    path: AppRoutes.USERS,
    exact: true,
    name: "Users",
    component: Users
  },
  {
    path: AppRoutes.PROJECT,
    exact: true,
    name: "Projects",
    component: Projects
  },
  {
    path: AppRoutes.DONATIONS,
    exact: true,
    name: "Donations",
    component: Donations
  },
  {
    path: AppRoutes.MONTHLY_DONATIONS,
    exact: true,
    name: "Monthly Payments",
    component: MonthlyDonations
  },
  {
    path: AppRoutes.COMMENTS,
    exact: true,
    name: "Comments",
    component: Comments
  },
  {
    path: AppRoutes.CONTACTUS,
    exact: true,
    name: "Contactus",
    component: ContacusList
  }
];

export default routes;
