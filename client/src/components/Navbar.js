import { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
	const history = useHistory();
	const auth = useContext(AuthContext);
	const logoutHandler = (event) => {
		event.preventDefault();
		auth.logout();
		history.push("/");
	};
	return (
		<nav>
			<div className="container">
				<div className="nav-wrapper">
					<NavLink to="/" className="brand-logo">
						Linker
					</NavLink>
					<ul id="nav-mobile" className="right hide-on-med-and-down">
						<li>
							<NavLink to="/create">Создать</NavLink>
						</li>
						<li>
							<NavLink to="/links">Ссылки</NavLink>
						</li>
						<li>
							<a href="/" onClick={logoutHandler}>
								Выйти
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};
