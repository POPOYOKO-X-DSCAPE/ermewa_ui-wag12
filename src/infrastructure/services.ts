import { createEnvironment } from "@popoyoko/free";

const baseUrl = import.meta.env.VITE_API_HOST;

const { createServices } = createEnvironment({
  credentials: {
    username: "mzeghdoudi",
    password: "Paris2024",
  },
  token: "",
});

const services = createServices(
  {
    dummy: {
      baseUrl,
      endpoints: {
        auth: {
          methods: ["GET"],
          path: "/api/dummy/v1/request?param=noparam",
          config: ({ credentials: { username, password } }) => {
            return {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${btoa(`${username}:${password}`)}`,
              },
            };
          },
        },
      },
    },
    wag12: {
      baseUrl,
      endpoints: {
        parameters: {
          methods: ["GET"],
          path: "/app/WAG12/ATL?request=XPRM",
        },
        data: {
          methods: ["GET"],
          path: "/app/WAG12/ATL/000122?request=XDATA",
        },
      },
    },
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }
);

export default services;
