import { createEnvironment } from "@packages/free";

const {
	VITE_API_HOST,
	VITE_API_PATH_NAME,
	VITE_ENABLE_OFFLINE_SERVICES,
	VITE_OFFLINE_API_PORT,
	VITE_IS_LOCAL,
} = import.meta.env;

let baseUrl: string;
let pathName = "";

const isOfflineMode = VITE_ENABLE_OFFLINE_SERVICES === "true";
const offlinePort = VITE_OFFLINE_API_PORT;

switch (import.meta.env.MODE) {
	case "development": {
		const segments = new URL(window.location.href).pathname
			.split("/")
			.filter(Boolean);
		const rootFolderName = segments[0];
		const rootFolderSid = segments[1];

		baseUrl = isOfflineMode
			? VITE_IS_LOCAL === "true"
				? `http://localhost:${offlinePort}`
				: `${window.location.origin}/api`
			: VITE_API_HOST;
		pathName = `${VITE_API_PATH_NAME}/${rootFolderName}/${rootFolderSid}`;

		break;
	}
	default:
		baseUrl =
			VITE_API_HOST || window.location.origin + window.location.pathname;
		break;
}

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
				wagons: {
					methods: ["GET"],
					path: `${pathName}?request=XSEL`,
				},
				parameters: {
					methods: ["GET"],
					path: `${pathName}/:macNumber?request=XPRM`,
				},
				data: {
					methods: ["GET"],
					path: `${pathName}/:macNumber?request=XDATA`,
				},
			},
		},
	},
	{
		headers: {
			"Content-Type": "application/json",
		},
		credentials: isOfflineMode ? "omit" : "include",
	},
);

export default services;
