import { Route, Routes } from "react-router-dom";
import { routes } from "@/routes.ts";

const Router = () => (
  <Routes>
    {routes.map((route) => (
      <Route key={route.path} path={route.path} element={<route.page />} />
    ))}
  </Routes>
);

export default Router;
