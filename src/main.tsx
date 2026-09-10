import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppContextProvider } from "./presentation/contexts/app-context.tsx";

import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<AppContextProvider>
				<App />
			</AppContextProvider>
		</StrictMode>,
	);
} else {
	console.error("Element with id 'root' not found.");
}
