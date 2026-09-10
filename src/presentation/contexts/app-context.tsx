import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import initializeApp from "../../domain/use-cases/initialize-app";

type AppContextState = {
	payload: Payload;
	loading: boolean;
	error: string | null;
	reload: () => Promise<void>;
};

const AppContext = createContext<AppContextState | undefined>(
	undefined,
);

type Payload = Awaited<ReturnType<typeof initializeApp> | null>;

export const AppContextProvider = ({
	children,
}: { children: ReactNode }) => {
	const [payload, setPayload] = useState<Payload>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadApp = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const initialized = await initializeApp();
			setPayload(initialized);
		} catch (err) {
			console.error("Failed to initialize app:", err);
			setError(err instanceof Error ? err.message : String(err));
			setPayload(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadApp();
	}, [loadApp]);

	const reload = useCallback(async () => {
		await loadApp();
	}, [loadApp]);

	return (
		<AppContext.Provider
			value={{
				payload,
				loading,
				error,
				reload,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = (): AppContextState => {
	const ctx = useContext(AppContext);
	if (!ctx) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return ctx;
};
