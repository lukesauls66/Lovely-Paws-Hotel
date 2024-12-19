import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import LandingPage from "../components/LandingPage";
import ServicesPage from "../components/ServicesPage";
import ReviewsPage from "../components/ReviewsPage";
import { UserPetList, UserPetDetail } from "../components/UserPets";
import { StaffPetList, StaffPetDetail } from "../components/StaffPets";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "reviews",
        element: <ReviewsPage />,
      },
      {
        path: "pets",
        element: <UserPetList />,
        children: [
          {
            path: ":petId",
            element: <UserPetDetail />,
          },
        ],
      },
      {
        path: "staff/pets",
        element: <StaffPetList />,
        children: [
          {
            path: ":petId",
            element: <StaffPetDetail />,
          },
        ],
      },
    ],
  },
]);
