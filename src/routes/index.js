import categoriasRoute from "./categoriasRoute.js";
import autoresRoute from "./autoresRoute.js";
import usuariosRoute from "./usuariosRoute.js";
import livrosRoute from "./livrosRoute.js";

function Routes(app) {
	categoriasRoute(app);
	autoresRoute(app);
	usuariosRoute(app);
	livrosRoute(app);
}

export default Routes;