import type { Server } from "@/types/server.ts";

export const serverDefault: Server = {
  id: "",
  name: "",
  note: "",
  tags: [],
  // icon: "",
  color: "#62b6e7",

  provider: {
    provider: "",
    type: "VPS",
    product: "",
    price: 0,
  },

  location: {
    region: "",
    datacenter: "",
    host_system: "",
  },

  hardware: {
    cpu: {
      manufacturer: "Intel",
      model: "",
      count: 1,
      core_count: 1,
      thread_count: 1,
      base_frequency: 1,
    },
    memory: {
      generation: "DDR4",
      ecc: false,
      size: 1,
      frequency: 2400,
    },
    disk: [],
  },

  network: {
    public: {
      ipv4: [],
      ipv6: [],
    },
    private: {
      ip: "",
    },
  },

  access: {
    regular: {
      port: 22,
      user: "root",
      private: false,
    },
    emergency: {
      root_password: "",
      method: "VNC",
      address: "",
      username: "",
      password: "",
    },
  },
};

export default serverDefault;
