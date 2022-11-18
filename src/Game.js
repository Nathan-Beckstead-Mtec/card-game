import React, { useState } from "react";
import Cardholder from "./Cardholder";

import { gamecontext } from "./context";
import { useContext } from "react"; //not needed if just providing context




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

		this.cardholderOwner = [0,0,0,0,1,1,1,1];
		this.CardholderType = ["table","table","table","table","table","table","table","table"];
		//"table": the cards that are played
		//"hand": the cards in the hand
		this.turn = 0;

		this.playerData = [{name:"bob"}, {name:"alice"}];
		const testdeck = ["wolf","rattle snek","leech","snek","bunny","elephant","leviathan pup","bison","puppy","venom","Squirrel","goat","sheep","vampirism","spider","fox"];
		this.deck = [new deck(testdeck), new deck(testdeck)];


		this.titles = {};
		this.health = {};
		this.attac = {};
		this.cost = {};
		this.sigils = {};

		// this.imgUrl = {};
		this.svgindex = {};
	}


	testInit() {
		console.info("button clicked here");
		// this.placeNewCard(this.defineNewCard("wolf"), this.newcardholder());
		// this.placeNewCard(this.defineNewCard("goat"), this.newcardholder());
		this.placeNewCardInNewCardHolder(this.defineNewCard("puppy"));

		// this.newcardholder((newindex) => {console.warn(this);this.placeNewCard(this.defineNewCard("snek"),newindex);});


		//debug
		/*let foxcard = this.defineNewCard("fox");
		console.log("foxcard: " + foxcard);
		let cardholderfox = this.newcardholder();
		console.log("cardholderfox: " + cardholderfox);
		this.placeNewCard(foxcard,cardholderfox);
		*/
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



	placeNewCardInNewCardHolder(id){
		this.setState(curr => {
			console.groupCollapsed("placeNewCardInNewCardHolder");
				console.log(this.constructor.name);
				console.log("attempting to place: (id: " + id + ", name: " + this.titles[id] + ")");
				console.log("internal var:");
			let cardholdercopy = Array.from(curr.cardholders);
				console.log(cardholdercopy);
			let index = cardholdercopy.length;
				console.log("index:");
				console.log(index);
			cardholdercopy[index] = id;
			console.groupEnd("placeNewCardInNewCardHolder");
			return {cardholders: cardholdercopy};
		});

	}


	placeNewCard(id, index) {
		console.log("seccond");
		if (this.state.cardholders[index] == undefined) {
			console.error("cannot place card: (id: " + id + ", name: " + this.titles[id] + ") in undefined");
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
		});
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

		thus.setcard_raw(oldindex, null, thus);
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
		console.group("sanity checker");
			console.groupCollapsed("all cards defined");
				console.log(this.titles);
			console.groupEnd("all cards defined");

		Object.keys(this.titles).forEach(key => {
			let countOfthisKey = this.state.cardholders.reduce((prev,curr) => prev + (curr == key ? 1 : 0), 0);
			console.assert(countOfthisKey == 1, {key, name: this.titles[key] ,countOfthisKey, errorMsg: (countOfthisKey > 1 ? "this card is in multiple card holders at the same time" : "this card is not in a card holder" ) });
			console.assert(this.health[key] > 0, {key, name: this.titles[key] , health: this.health[key], errorMsg: "this card shouuld be dead"});
		});
		console.groupEnd("sanity checker");
	}

	render() {
		let providecontext = { cards: this.state.cardholders, movecard: ((a, b) => this.movecard(a, b, this)) };
		console.debug(this);
		// console.warn(this.state.cardholders);
		let cardholderJSX = this.state.cardholders.map((val, index) => <Cardholder index={index} />);

		this.sanitychecker();


		return (
			<div className={"testholders-css"} >
				<button onClick={() => this.testInit()}>place test Cards</button>
				<gamecontext.Provider value={this.getContextValue()}>
					{cardholderJSX}
				</gamecontext.Provider>
			</div>
		);
	}

}

Game.LoadCardPack("./cardPack.json");






class deck{
	#currentbag;

	constructor(deck){
		this.#currentbag = [];
		this.deck = Array.from(deck);
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
		return this.#currentbag.shift();
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