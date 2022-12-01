import React, { useState } from "react";
import Cardholder from "./Cardholder";

import { gamecontext } from "./context";
import { useContext } from "react"; //not needed if just providing context
import Cardrow from "./Cardrow";

import './css/game.css';
import { toHaveDisplayValue } from "@testing-library/jest-dom/dist/matchers";


export default class Game extends React.Component {

	// static cardTemplate = require("./cardTemplate.json");
	static LoadCardPack = function (url) {
		fetch("./" + url).then(data1 => data1.json().then(data => {
			data.forEach(thing => {
				Game.Cards[Game.Cards.length] = thing;

				//FREEZE?
					// Object.defineProperty(Game.Cards())
					// a = {writable: false,enumerable: true,configurable: false, value: thing}


				//replace ment is out because it is static (array.concat)
				//but mutation the manual was is fine;
			});
			console.log("loaded cardpack: " + url);
			console.log(Game.Cards);
		}));
	}
	static Cards = [];


	constructor() {
		super();

		this.state = {};
		this.state.cardholders = [null,null,null,null,null,null,null,null];

		this.CardholderProps = [
			{type: "table", owner: 0},
			{type: "table", owner: 0},
			{type: "table", owner: 0},
			{type: "table", owner: 0},
			{type: "table", owner: 1},
			{type: "table", owner: 1},
			{type: "table", owner: 1},
			{type: "table", owner: 1}
		];
		//"table": the cards that are played
		//"hand": the cards in the hand
		this.turn = 0;

		this.playerData = [{name:"blue"}, {name:"red"}];
		// const testdeck = ["wolf","rattle snek","leech","snek","bunny","elephant","leviathan pup","bison","puppy","venom","Squirrel","goat","sheep","vampirism","spider","fox"];
		// const testdeck = ["wolf","rattle snek","leech","snek","bunny","elephant","leviathan pup","bison","puppy","Squirrel","goat","sheep","spider","fox"];
		const testdeck = ["wolf","rattle snek","leech","leech","snek","snek","bunny","bison","puppy","Squirrel","Squirrel","goat","sheep","spider","spider","fox"];
		this.decks = [new deck(testdeck), new deck(testdeck)];


		this.titles = {};
		this.health = {};
		this.attac = {};
		this.cost = {};
		this.sigils = {}; //stores sigils for card
		this.dataSigils = {};  //stores data used for sigils

		// this.imgUrl = {};
		this.svgindex = {};  //stores the index into Game.cards to get the svg data (Game.cards[svgindex[id]].svg )

		this.hasTriggeredFunFeature = false;
		
		this.playerHealth = [20,20];
		
		this.enemyCardCount = 30;
	}


//#######################
//#                     #
//# START OF GAME LOGIC #
//#                     #
//#######################

	getIndexFromId(id){
		return this.state.cardholders.findIndex(curr => curr == id);
	}

	getTargetIndexFromIndex(index){
		let props = this.CardholderProps[index];
		let id = this.state.cardholders[index]; //for debug MSGs
		if(props.type != "table"){
			console.warn("a non-table card (id: " + id + ") called getTarget");
			return null;
		}
		let targetIndex = (index + 4 ) % 8 //sketchy math go burrr
		
		if(this.CardholderProps[targetIndex].type != "table"){
			throw Error("id: " + id + " targeted a card with index: " + targetIndex + " but the targeted card is not on the table");
		}
		if(this.CardholderProps[targetIndex].owner ==  props.owner){
			throw Error("id: " + id + " targeted a card with index: " + targetIndex + " but the targeted card and the targeter card have the same owner");
		}

		return targetIndex;
	}
	getTargetIndex(id){
		//get card id then return the index of the target cards
		let index = this.getIndexFromId(id);
		return this.getTargetIndexFromIndex(index);
	}
	getTargetId(id){
		//get card id then return the id of the target cards
		return this.state.cardholders[this.getTargetIndex(id)];
	}

	handleTurn(player){
		//calls turnAttack() for each card owned by (player)
		//calls turnEndRunSigils() for each card owned by (player)
		//rotate the gameboard
		//toggle this.player
		console.log("handle turn called");
		let cardIds = this.state.cardholders.filter((curr,index) => {
			const props = this.CardholderProps[index];
			return (props.owner == player && props.type == "table");
		});

		cardIds.forEach((cardId) => this.turnAttack(cardId));
		cardIds.forEach((cardId) => this.turnEndRunSigils(cardId));

		this.turn = (this.turn + 1) % 2; //sketchy math go burrr (this ones not too bad)
	}

	turnAttack(id){
		//get attack
		//call getTarget()
		//call applyDamage()
		//handle my attack sigils
		//animate card leaping at target
		
		if (id === null){
			return;
		}

		let target = this.getTargetId(id);
		let dmg = this.attac[id];
		
		if(target === null || target === undefined){
			console.debug(this.titles[id] + "(" + id + ") has no target (" + "). attacking player");
			let owner = this.CardholderProps[this.getIndexFromId(id)].owner;
			let targetPlayer = 1 - owner; //sketchy math if players > 2
			this.damagePlayer(targetPlayer, dmg, id);
			return;
		}


		let hit = this.applyDamage(target, dmg, id);


		let mysigils = this.sigils[id];
		if(typeof mysigils != "undefined"){
			mysigils = mysigils.map(curr => curr.name); //hacky because I don't want to refactor everything to change the format of cardPack.json
			console.debug(this.titles[id] + "(" + id + ") has sigils: " + mysigils.join(","));
			if (hit && mysigils.includes("venom")){
				if(typeof this.dataSigils[target] == "undefined"){
					this.dataSigils[target] = {};
				}

				this.dataSigils[target].venom = 1 + (this.dataSigils[target]?.venom ?? 0);
				console.info( this.titles[id] + "(" + id + ") injected " +  this.titles[target] + "(" +target + ") with venom. now has " + this.dataSigils[target].venom + " venom.");
				//aka this.dataSigils[target].venom += 1; start from 0
			}
			if (hit && mysigils.includes("vampirism")){
				this.health[id]++;
				console.info( this.titles[id] + "(" + id + ") got health from vampirism");
			}
		}

	}

	turnEndRunSigils(id){
		if (id === null){
			return;
		}

		//my sigils

		
		//sigils that affected me
		let datasig = this.dataSigils[id];
		if (datasig != undefined){

			//venom
			if(typeof datasig.venom != undefined){
				console.info(this.titles[id] + "(" + id + ") was afected by " + datasig.venom + " venom");
				this.applyDamage(id,datasig.venom,id); //why r u hitting yourself?
			}
		}
		return;
	}

	damagePlayer(player, ammount, fromId = null){
		//OUCH!

		console.info(this.titles[fromId] + "(" + fromId + ") attacked player " + player + " aka " +this.playerData[player].name + " for " + ammount + " damage.");

		if(player == 1){
			console.warn("LOL, this is (currently) a single player survival game, the other guy can't take damage");
			return;
		}


		this.playerHealth[player] -= ammount;
		if (this.playerHealth[player] <= 0){
			alert("you died\nContinue?");
			this.playerHealth[player] = 10;
		}
	}

	applyDamage(id, ammount, fromId = null){
		//trusts inputs

		if (id === null || id === undefined){
			console.error("applyDamage() got target null or undefined, id: " + id + " ammount: " + ammount + " fromId: " + fromId);
			return false;
		}
		//remove health and handle reactonary sigils
		//animate losing health
		//return true if contact (i.e. if apply venom)

		//NOTE:
		//applyDamage(id,0) shouldn't error, rather it acts like a contact check

		if (ammount < 0 ){
			console.error("apply Damage got ammount < 0, id: " + id + " ammount: " + ammount + " fromId: " + fromId);
			return false;
		}
		console.info(this.titles[fromId] + "(" + fromId + ") attacked " + this.titles[id] + "(" + id + ") for " + ammount + " damage");
		let finalhealth = (this.health[id] -= ammount);
		if(finalhealth <= 0){
			this.killCard(id,fromId);
		}
		return true;
	}

	killCard(id,fromId = null){
		//animate card burning
		//deallocate memory
		//return amount of sacrifice made

		console.info(this.titles[id] + " (" + id + ") died");

		delete this.titles[id];
		delete this.health[id];
		delete this.attac[id];
		delete this.cost[id];
		delete this.sigils[id];
		delete this.dataSigils[id];
		delete this.svgindex[id];

		this.setState(curr => {
			let copy = Array.from(curr.cardholders);
			const index = copy.findIndex(curId => curId == id);
			copy[index] = null;
			return {cardholders: copy};
		});
	}

	drawcard(e, thus){
		let cardId = thus.defineNewCard(thus.decks[thus.turn].draw());
		thus.placeNewCardInNewCardHolder(cardId, "hand", thus.turn, thus);
		// this.placeNewCardInNewCardHolder(this.defineNewCard("puppy"));
		// this.placeNewCard(this.defineNewCard(this.decks[this.CardholderProps[4].owner].draw()),4);

	}

	passTurnbutton(e, thus){
		console.info("end turn pressed here");
		console.group("end turn");

		e.target.disabled = true; //e = button clicked event

		if (thus.turn != 0){
			console.error("How did I get here?");
			thus.handleTurn(thus.turn); //Returns to normal state?
			return;
		}

		thus.handleTurn(0);

		
		let AI = (e, finish) => {
			//enemy AI
			//am I out of cards?
			//yes
				// do I still have cards alive?
				//no
					//win.exe
				//(yes would just continue)
			//no
				//do I have room to place a cards (and get a list of avalible spaces to use in a randomizer later)
				//mutate previous list to prefer placing cards infront of other cards (no cheep shots to player)
				//place random card
			console.group("AI");

			function Randint256(){
				let values = new Uint8Array(1);
				window.crypto.getRandomValues(values);
				return values[0];
			}

			let mycardindicies = Array.from(this.CardholderProps).map((curr,index) => ({keep:curr.type == "table" && curr.owner == 1, index: index})).filter(curr => curr.keep);
			let mycards = mycardindicies.map(curr => ({id :this.state.cardholders[curr.index], index:curr.index}));

			console.log("AI.mycardindicies:");
			console.log(mycardindicies);
			console.log("AI.mycards:");
			console.log(mycards);

			if (this.decks[1].getDrawnCards() >= this.enemyCardCount){
				//out of cards
				console.log("out of cards");
				if(! mycards.some(curr => curr.id !== null)){
					//no alive cards
					alert("You Won!\n\n");
				}
			} else{
				//still got cards
				let openindicies = mycards.filter(curr => curr.id === null);
				if(openindicies.length > 0){
					//empty space for card (I can place a card)
					console.log("have cards and space for one");

					let canidates;
					let preferedIndicies = openindicies.filter(curr => null !== this.state.cardholders[this.getTargetIndexFromIndex(curr.index)]) //prefer cards with a opposing card
					if (preferedIndicies.length > 0){
						canidates = preferedIndicies;
						console.log("using prefered indicies");
					} else{
						canidates = openindicies;
						console.log("using backup indicies");
					}

					let placeCardIndex = canidates[Randint256() % canidates.length].index; //technically has skew when has 3 cards to chose from (bc 256 % 3 != 0)
					console.log("index: " + placeCardIndex);
					this.placeNewCard(this.defineNewCard(this.decks[1].draw()),placeCardIndex, () => finish(e,this));
				}
			}

			console.groupEnd("AI");
		}
		AI = AI.bind(thus,e,finish);
		AI();

		function finish(e,thus){

			thus.handleTurn(1);

			console.assert(thus.turn == 0);
			thus.drawcard(e,thus);

			e.target.disabled = false;
			console.groupEnd("end turn");
			thus.forceUpdate();
		}
		console.log("done, it's all async now");
	}

//#####################
//#                   #
//# END OF GAME LOGIC #
//#                   #
//#####################



	testInit() {
		console.info("button clicked here");
		// this.placeNewCardInNewCardHolder(this.defineNewCard("puppy"));

		this.placeNewCard(this.defineNewCard(this.decks[this.CardholderProps[0].owner].draw()),0);
		this.placeNewCard(this.defineNewCard(this.decks[this.CardholderProps[4].owner].draw()),4);



		// this.placeNewCard(this.defineNewCard("wolf"), this.newcardholder());
		// this.placeNewCard(this.defineNewCard("goat"), this.newcardholder());

		// this.newcardholder((newindex) => {console.warn(this);this.placeNewCard(this.defineNewCard("snek"),newindex);});
	}
	testInit2(){
		this.placeNewCard(this.defineNewCard("rattle snek"),1);
		this.placeNewCard(this.defineNewCard("leech"),2);
		this.placeNewCard(this.defineNewCard("spider"),3);
	}


	newcardholder(callbacknext = () => {}) {
		//
		console.info("first");
		let index;
		this.setState(curr => {
			console.info("after first?");
			console.log("thisone:");
			console.log(curr);
			let curopy = Array.from(curr);
			index = curopy.cardholders.length;
			curopy.cardholders[index] = null;
			// console.info("first");

			return {cardholders: curopy};
		}, callbacknext(index));
		return;
	}

	killCardholder(index, thus = this){
		if (thus.CardholderProps[index].type == "table"){
			console.error("you probably don't want to killCardholder of type hand");
			return;
		}
		thus.CardholderProps = thus.CardholderProps.filter((item, itemIndex) => itemIndex != index);
		thus.setState(curr => {
			let copy = curr.cardholders.filter((item, itemIndex) => itemIndex != index);
			return {cardholders: copy};
		});
	}

	placeNewCardInNewCardHolder(id, type, owner, thus = this){
		
		function statemutator(curr, thus){
			console.groupCollapsed("placeNewCardInNewCardHolder");
				// console.log("this.constructor.name:");
				// console.log(this.constructor.name);
				console.log("thus.constructor.name:");
				console.log(thus.constructor.name);
				console.log("attempting to place: (id: " + id + ", name: " + thus.titles[id] + ")");
				console.log("internal var:");
			let cardholdercopy = Array.from(curr.cardholders);
				console.log(cardholdercopy);
			let index = cardholdercopy.length;
				console.log("index:");
				console.log(index);
			cardholdercopy[index] = id;

			thus.CardholderProps[index] = {type: type, owner: owner};

			console.groupEnd("placeNewCardInNewCardHolder");
			return {cardholders: cardholdercopy};
		}

		thus.setState(curr => statemutator(curr, thus));

	}


	placeNewCard(id, index, callback = () => {}) {
		if (this.state.cardholders[index] === undefined) {
			console.error("cannot place card: (id: " + id + ", name: " + this.titles[id] + ") in undefined");
			console.log(this.state.cardholders);
			throw Error("cannot place card in undefined");
			return;
		}
		if (this.state.cardholders[index] != null) {
			console.error("card already exists in index: " + index);
			throw Error("card already exists in index: " + index);
			return;
		}
		this.setState(curr => {
			let current = Array.from(curr.cardholders);
			current[index] = id;
			return {cardholders: current};
		}, callback);
	}


	defineNewCard(name) {
		//returns id;
		let id = crypto.randomUUID();
		let index = Game.Cards.findIndex(iscard => iscard.name === name);
		let cardObj = Game.Cards[index];
		this.titles[id] = name;
		// this.titles[id] = cardObj.name;
		this.health[id] = cardObj.health;
		this.attac[id] = cardObj.attac;
		this.cost[id] = cardObj.cost;
		this.sigils[id] = cardObj.sigils;


		this.svgindex[id] = index;



		return id;
	}



	movecard(index, id, thus) {
		//moves the card (selected by id) to index of this.state.cardholders from whereever it was before
		//this function is not to create or destroy cards
		//callers: (when a card is dropped onto a cardholder)

		console.info("moving id: " + id + " to index: " + index);

		if (thus.state.cardholders[index] != null) {
			console.error("Future me: I won't overwrite preexisting card at index:" + index + " with id:" + id);
			return;
		}
		if (id == null) {
			console.error("Future me: this might dissappear a card");
			return;
		}
		let oldindex = findId(id);
		if (oldindex < 0) {
			console.error("Future me: cannot find old location of card with id:" + id + " (dont use movecard() to add a new card) or (illegal dragged card)");
			return;
		}
		console.info("...from: " + oldindex);

		if(thus.CardholderProps[oldindex].owner != thus.CardholderProps[index].owner){
			console.warn("a card just transfered owners but its a feature");
			if (!thus.hasTriggeredFunFeature){
				setTimeout(alert("Note: A card just transfered owners but it's a fun feature! :D"),20);
			}

			thus.hasTriggeredFunFeature = true;
		}


		if (thus.CardholderProps[oldindex].type == "hand"){
			thus.killCardholder(oldindex);
		} else{
			thus.setcard_raw(oldindex, null, thus);
		}

		thus.setcard_raw(index, id, thus);

		function findId(id) {
			return thus.state.cardholders.findIndex(a => a == id);
		}
	}
	setcard_raw(index, id, thus) {
		//this is too much power to call directly
		thus.setState((current) => {
			let cards_temp = Array.from(current.cardholders);
			cards_temp[index] = id;
			return { cardholders: cards_temp };
		});
	}


	getContextValue() {

		let providecontext = { cards: this.state.cardholders, movecard: ((a, b) => this.movecard(a, b, this)) };


		providecontext.titles = this.titles;
		providecontext.health = this.health;
		providecontext.attac = this.attac;
		providecontext.cost = this.cost;
		providecontext.sigils = this.sigils;

		providecontext.svgindex = this.svgindex;
		// providecontext.imgUrl = this.imgUrl;
		/*
		let title = this.context.titles[id];
		let health = this.context.health[id];
		let attac = this.context.attac[id];
		let cost = this.context.cost[id];
		let imgUrl = this.context.imgUrl[id];
		*/
		return Object.freeze(providecontext);
	};


	sanitychecker(){
		// console.groupCollapsed("sanity checker");
			console.groupCollapsed("all cards defined");
				console.log(this.titles);
			console.groupEnd("all cards defined");

		Object.keys(this.titles).forEach(key => {
			let countOfthisKey = this.state.cardholders.reduce((prev,curr) => prev + (curr == key ? 1 : 0), 0);
			console.assert(countOfthisKey == 1, {key, name: this.titles[key] ,countOfthisKey, errorMsg: (countOfthisKey > 1 ? "this card is in multiple card holders at the same time" : "this card is not in a card holder" ) });
			console.assert(this.health[key] > 0, {key, name: this.titles[key] , health: this.health[key], errorMsg: "this card shouuld be dead"});
		});
		if(this.state.cardholders.length != this.CardholderProps.length){
			setTimeout(() => console.assert(this.state.cardholders.length == this.CardholderProps.length, {errorMsg: "length of cardholders and cardholderprops are not equal"}),
			500);
			;
		}
		// console.groupEnd("sanity checker");
	}

	render() {
		let providecontext = { cards: this.state.cardholders, movecard: ((a, b) => this.movecard(a, b, this)) };
		this.sanitychecker();


		// let cardholderJSX = this.state.cardholders.map((val, index) => <Cardholder index={index} />);

		console.log("Game.this:");
		console.log(this);


		this.CardholderProps.forEach((curr,index) => {curr.index = index;});

		//ghetto Array.group
		let locations = {};
		locations.hand1  = this.CardholderProps.filter(curr => curr.type == "hand"  && curr.owner == 1);
		locations.table1 = this.CardholderProps.filter(curr => curr.type == "table" && curr.owner == 1);
		locations.table0 = this.CardholderProps.filter(curr => curr.type == "table" && curr.owner == 0);
		locations.hand0  = this.CardholderProps.filter(curr => curr.type == "hand"  && curr.owner == 0);
		
		// console.log("Game.locations");
		// console.log(locations);


		// this.turn = 0;
		// this.playerData = [{name:"blue"}, {name:"red"}];
		let turnPlayerName = this.playerData[this.turn].name;
		let health = this.playerHealth[0];

		return (
			<div className="game">
				<div className="left">
					<h1>Health: {health}</h1>
					<h1>Turn: {turnPlayerName}</h1>
					<h1>bell</h1>
					<button onClick={() => this.testInit()}>place test Cards for opponent</button>
					<button onClick={() => this.testInit2()}>place test Cards2</button>
					<button onClick={() => this.handleTurn(this.turn)}>end {turnPlayerName}'s turn</button>
				</div>
				<gamecontext.Provider value={this.getContextValue()}>
					<div className="center">
						<div className="top">
							<Cardrow data={locations.hand1}  owner={1} type={"hand"}/>
							<Cardrow data={locations.table1} owner={1} type={"table"}/>
						</div>
						<div className="bottom">
							<Cardrow data={locations.table0} owner={0} type={"table"}/>
							<Cardrow data={locations.hand0}  owner={0} type={"hand"}/>
						</div>
					</div>
				</gamecontext.Provider>
				<div className="right">
					<button onClick={e => this.drawcard(e, this)}>draw card tester</button>
					<button onClick={e => this.passTurnbutton(e, this)}>end turn</button>
				</div>
			</div>
		);


		// return (
		// 	<div className={"testholders-css"} >
		// 		<button onClick={() => this.testInit()}>place test Cards</button>
		// 		<gamecontext.Provider value={this.getContextValue()}>
		// 			{cardholderJSX}
		// 		</gamecontext.Provider>
		// 	</div>
		// );
	}

}

Game.LoadCardPack("./cardPack.json");






class deck{
	#currentbag;
	#drawncards;

	constructor(deck){
		this.#currentbag = [];
		this.deck = Array.from(deck);
		this.#drawncards = 0;
	}
	peek(count = 1){
		if(count <= 0){
			throw Error("cannor peak less than or equal to 0 cards");
			return;
		}

		this.#ensuretop(count);
		if (count == 1 ){
			return this.#currentbag[0];
		}
		return Array.from(this.#currentbag).slice(0,count);
	}
	draw(){
		this.#ensuretop();
		this.#drawncards++;
		return this.#currentbag.shift();
	}

	getDrawnCards(){
		return this.#drawncards;
	}

	#ensuretop(num = 1){
		while (this.#currentbag.length < num){
			this.#shuffle();
		}
	}
	#shuffle(){
		let shuffleVal = new Uint32Array(this.deck.length);
		crypto.getRandomValues(shuffleVal);


		let anotherbag = Array.from(this.deck);
		anotherbag =  anotherbag.map((input, index) => {
			return { val: input, rand: shuffleVal[index] };
		});


		anotherbag.sort((a, b) => compare(a.rand, b.rand));


		anotherbag = anotherbag.map(input => {
			return input.val;
		});

		this.#currentbag = this.#currentbag.concat(anotherbag);

		function compare(a, b) {if (a < b) {return -1;}if (a > b) {return 1;}return 0;}
	}
}





function callcallback(callback){
	callback("hi");
}

function thing(a,b){
	console.log("a: " + a + ", b: " + b);
}