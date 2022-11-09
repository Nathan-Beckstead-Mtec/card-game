import Card from "./Card";
import FontSelect from "./fontselect";

function App() {

	return (
		<div className="testholders">
			<div className="card-holder" style={{height: "400px", width:"300px"}}>
				<Card cost={3} name={"KRAKEN"} attac="12" health={4} imgUrl="./SVG/mode-standard-kraken-svgrepo-com.svg"></Card>
			</div>
			<div className="card-holder" style={{height: "400px", width:"300px"}}>
				<Card cost={2} name={"SQUIRREL"} attac="1" health={9} imgUrl="./SVG/squirrel-svgrepo-com.svg"></Card>
			</div>
			{/* <FontSelect /> */}
		</div>
	);
}

export default App;
