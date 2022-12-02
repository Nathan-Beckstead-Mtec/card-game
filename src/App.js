import { Route, RouterProvider, createHashRouter } from "react-router-dom";
import Game from "./Game";
import Home from "./Home";


function App() {

	// const router = createBrowserRouter(createRoutesFromElements(
	// 	<Route path="/" element={<Home />}>
	// 		<Route path="game" element={<Game />} />
	// 	</Route>
	// ));
	
	const router = createHashRouter([
		{
			path:"/",
			element: <Home />
		},
		{
			path:"/game",
			element: <Game />
		},
	]);


	return (
		<RouterProvider router={router} />
	);


}

export default App;