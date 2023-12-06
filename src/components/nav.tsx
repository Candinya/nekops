import { NavLink } from "@mantine/core";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { navs } from "@/routes";
import { IconChevronRight } from "@tabler/icons-react";

const NavsWithSubsExpandIcon = () => (
  <IconChevronRight size="1rem" stroke={1.5} />
);

const Nav = () => {
  const location = useLocation();
  return (
    <>
      {navs.map((route) =>
        route.subs ? (
          <NavLink
            key={route.path}
            label={route.label}
            leftSection={<route.icon size="1rem" stroke={1.5} />}
            rightSection={<NavsWithSubsExpandIcon />}
            defaultOpened
          >
            {route.subs.map((route) => (
              <NavLink
                key={route.path}
                label={route.label}
                leftSection={<route.icon size="1rem" stroke={1.5} />}
                component={RouterNavLink}
                to={route.path}
                active={location.pathname === route.path} // TODO: Find a better way to use react-router-dom's NavLink's isActive status
              />
            ))}
          </NavLink>
        ) : (
          <NavLink
            key={route.path}
            label={route.label}
            leftSection={<route.icon size="1rem" stroke={1.5} />}
            component={RouterNavLink}
            to={route.path}
            active={location.pathname === route.path} // TODO: Find a better way to use react-router-dom's NavLink's isActive status
          />
        ),
      )}
    </>
  );
};

export default Nav;
