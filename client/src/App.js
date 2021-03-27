import "materialize-css";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Loader } from "./components/Loader";
import { AuthContext } from "./context/AuthContext";
import { useAuth } from "./hooks/auth.hook";
import { useRoutes } from "./routes";

function App() {
	const { token, login, logout, userId, ready } = useAuth();
	const isAuthenticated = !!token;
	const routes = useRoutes(isAuthenticated);

	if (!ready) {
		return <Loader />;
	}

	return (
		<AuthContext.Provider
			value={{ token, login, logout, userId, isAuthenticated }}
		>
			<BrowserRouter>
				{isAuthenticated && <Navbar />}
				<div className="container">{routes}</div>
			</BrowserRouter>
		</AuthContext.Provider>
	);
}

export default App;
