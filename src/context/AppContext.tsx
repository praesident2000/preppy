import { createContext, useContext, useEffect, useReducer } from "react";
import { reducer, initialState } from "../reducer";
import type { State, Action } from "../reducer";

type AppContextType = {
	state: State;
	dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		console.log(state)
	}, [state])

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (!context)
		throw new Error("useAppContext must be used within AppProvider");
	return context;
}
