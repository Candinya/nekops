import { Route, Routes } from "react-router-dom";
import { routes } from "@/routes";

const Router = () => (
  <Routes>
    {routes.map((route) => (
      <Route id={route.path} path={route.path} element={<route.page />} />
    ))}
  </Routes>
);

export default Router;
