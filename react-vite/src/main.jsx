import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import store from "./redux/store";
import { router } from "./router";
import { ModalProvider, Modal } from "./context/Modal";
import * as sessionActions from "./redux/session";
import { UserPetList, UserPetDetail } from "./components/UserPets";
import { StaffPetList, StaffPetDetail } from "./components/StaffPets"
import "./index.css";

if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ModalProvider>
        <RouterProvider router={router} />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pets" element={<UserPetList />} />
            <Route path="/pets/:petId" element={<UserPetDetail />} />
            <Route path="/staff/pets" element={<StaffPetList />} />
            <Route path="/staff/pets/:petId" element={<StaffPetDetail />} />
          </Routes>
        </Router>
        <Modal />
      </ModalProvider>
    </ReduxProvider>
  </React.StrictMode>
);
