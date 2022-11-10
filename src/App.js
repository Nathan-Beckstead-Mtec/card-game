import Card from "./Card";
import Cardholder from "./Cardholder";
import FontSelect from "./fontselect";
import Game from "./Game";

function App() {


	return (
		<Game />
	);



	return (
		<div className="testholders">
			<Cardholder holding={42}/>
			<Cardholder holding={69}/>
			<Cardholder />
			<Cardholder />
			{/* <FontSelect /> */}
		</div>
	);
}

export default App;


/*
<div className="card-holder" style={{height: "400px", width:"300px"}}>
				<Card cost={3} name={"KRAKEN"} attac="12" health={4} imgUrl="./SVG/mode-standard-kraken-svgrepo-com.svg"></Card>
			</div>
			<div className="card-holder" style={{height: "400px", width:"300px"}}>
				<Card cost={2} name={"SQUIRREL"} attac="1" health={9} imgUrl="./SVG/squirrel-svgrepo-com.svg"></Card>
			</div>
			<div className="card-holder" style={{height: "400px", width:"300px"}}>
			</div>
			<div className="card-holder" style={{height: "400px", width:"300px"}}>
			</div>











*/