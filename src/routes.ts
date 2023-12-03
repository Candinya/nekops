import Home from "@/pages/home";
import Connect from "@/pages/connect";
import Rescue from "@/pages/rescue";
import Servers from "@/pages/servers";
import Settings from "@/pages/settings";

import {
  IconCirclesRelation,
  IconHeartbeat,
  IconHome,
  IconServerCog,
  IconSettings,
} from "@tabler/icons-react";

export const routes = [
  {
    label: "Home",
    icon: IconHome,
    path: "/",
    page: Home,
  },
  {
    label: "Connect",
    icon: IconCirclesRelation,
    path: "/connect",
    page: Connect,
  },
  {
    label: "Rescue",
    icon: IconHeartbeat,
    path: "/rescue",
    page: Rescue,
  },
  {
    label: "Servers",
    icon: IconServerCog,
    path: "/servers",
    page: Servers,
  },
  {
    label: "Settings",
    icon: IconSettings,
    path: "/settings",
    page: Settings,
  },
];

export default routes;
