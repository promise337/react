import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Subscription from "../pages/Subscription";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/subscription" element={<Subscription />} />
    </Routes>
  );
}
