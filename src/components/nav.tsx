import { NavLink } from "@mantine/core";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { routes } from "@/routes";

const Nav = () => {
  const location = useLocation();
  return (
    <>
      {routes.map((route) => (
        <NavLink
          id={route.path}
          label={route.label}
          leftSection={<route.icon size="1rem" stroke={1.5} />}
          component={RouterNavLink}
          to={route.path}
          active={location.pathname === route.path} // TODO: Find a better way to use react-router-dom's NavLink's isActive status
        />
      ))}
    </>
  );
};

export default Nav;
