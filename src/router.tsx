import { Route, Routes } from "react-router-dom";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Settings from "@/pages/settings";

const Router = () => (
  <Routes>
    {/* Public Introduction */}
    <Route path={"/"} element={<Home />} />

    {/* Authentication */}
    <Route path={"/auth/*"} element={<Auth />} />

    {/* Dashboard */}
    <Route path={"/dashboard/*"} element={<Dashboard />} />

    {/* Settings */}
    <Route path={"/settings/*"} element={<Settings />} />
  </Routes>
);

export default Router;
