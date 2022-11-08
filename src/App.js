import Card from "./Card";

function App() {

	return (
		<div>
			<div className="card-holder" style={{height: "200px", width:"100px"}}>
				<Card cost={3} name={"kraken"} attac="6" health={5} imgUrl="./SVG/mode-standard-kraken-svgrepo-com.svg"></Card>
			</div>
			<div className="card-holder" style={{height: "400px", width:"300px"}}>
				<Card cost={0} name={"squirrel"} attac="0" health={1} imgUrl="./SVG/squirrel-svgrepo-com.svg"></Card>
			</div>
		</div>
	);
}

export default App;
