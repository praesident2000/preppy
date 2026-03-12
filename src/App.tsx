import { AppProvider } from "./context/AppContext";
import AppInner from "./components/layout/AppInner/AppInner";

function App() {
	return (
		<AppProvider>
			<AppInner />
		</AppProvider>
	);
}

export default App;
