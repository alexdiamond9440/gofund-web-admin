import { CNavItem } from "@coreui/react";
import { AppRoutes } from "./Config";
const navigation = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: AppRoutes.HOME,
  },
  {
    component: CNavItem,
    name: "Users",
    to: AppRoutes.USERS
  },
  {
    component: CNavItem,
    name: "Projects",
    to: AppRoutes.PROJECT,
  },
  {
    component: CNavItem,
    name: "All Payments",
    to: AppRoutes.DONATIONS,
  },
  {
    component: CNavItem,
    name: "Monthly Payments",
    to: AppRoutes.MONTHLY_DONATIONS,
  }
];

export default navigation;
