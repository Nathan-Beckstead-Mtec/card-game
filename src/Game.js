import React, { useState } from "react";
import Cardholder from "./Cardholder";

import { gamecontext } from "./context";
import { useContext } from "react"; //not needed if just providing context

export default class Game extends React.Component {

    static cardTemplate = require("./cardTemplate.json");

    constructor() {
        super();

        this.state = {};
        this.state.cards = [null, null, null, null];

        this.titles = {};
        this.health = {};
        this.attac = {};
        this.cost = {};
        this.sigils = {};

        this.imgUrl = {};
        this.svg = {};
    }


    testInit() {
        // this.placeNewCard(this.defineNewCard("shrimp"), 0);
        // this.placeNewCard(this.defineNewCard("angler fish"), 0);
        this.placeNewCard(this.defineNewCard("net"), 0);
        this.placeNewCard(this.defineNewCard("kraken"), 1);
        // this.placeNewCard(this.defineNewCard("stork"), 2);
        // this.placeNewCard(this.defineNewCard("octopus"), 2);
        // this.placeNewCard(this.defineNewCard("mine"), 2);
    }



    placeNewCard(id, index) {
        if (this.state.cards[index] != null) {
            console.error("card already exists in index: " + index);
            throw Error("card already exists in index: " + index);
            return;
        }
        this.setState(curr => {
            let current = curr.cards;
            current[index] = id;
            return current;
        });
    }


    defineNewCard(name) {
        //returns id;
        let id = crypto.randomUUID();
        let cardObj = Game.cardTemplate[name];
        this.titles[id] = name;
        // this.titles[id] = cardObj.name;
        this.health[id] = cardObj.health;
        this.attac[id] = cardObj.attac;
        this.cost[id] = cardObj.cost;
        this.sigils[id] = cardObj.sigils;


        this.imgUrl[id] = "./SVG/cards/" + cardObj.imgName + ".svg";
        if (false && "svg local") {
            let thus = this;
            let imgUrl = "./SVG/cards/" + cardObj.imgName + ".svg";
            let promise = fetch(imgUrl);
            promise.then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                return response.json();
            })
                .then((data) => {
                    console.debug(data);
                    //   setcardSVG(data,id,thus);
                })
                .catch((error) => {
                    console.error(`Could not get card SVG: ${error}`);
                });
            //original ./SVG/squirrel-svgrepo-com.svg
            function setcardSVG(data, id, thus) {
                thus.svg[id] = data;
            }
        }



        return id;
    }



    movecard(index, id, thus) {
        //moves the card (selected by id) to index of this.state.cards from whereever it was before
        //this function is not to create or destroy cards
        //callers: (when a card is dropped onto a cardholder)


        if (thus.state.cards[index] != null) {
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

        thus.setcard_raw(oldindex, null, thus);
        thus.setcard_raw(index, id, thus);

        function findId(id) {
            return thus.state.cards.findIndex(a => a == id);
        }
    }
    setcard_raw(index, id, thus) {
        //this is too much power to call directly
        thus.setState((current) => {
            let cards_temp = Array.from(current.cards);
            cards_temp[index] = id;
            return { cards: cards_temp };
        });
    }


    getContextValue() {

        let providecontext = { cards: this.state.cards, movecard: ((a, b) => this.movecard(a, b, this)) };


        providecontext.titles = this.titles;
        providecontext.health = this.health;
        providecontext.attac = this.attac;
        providecontext.cost = this.cost;
        providecontext.sigils = this.sigils;

        providecontext.svg = this.svg;
        providecontext.imgUrl = this.imgUrl;
        /*
        let title = this.context.titles[id];
        let health = this.context.health[id];
        let attac = this.context.attac[id];
        let cost = this.context.cost[id];
        let imgUrl = this.context.imgUrl[id];
        */
        return Object.freeze(providecontext);
    };




    render() {
        let providecontext = { cards: this.state.cards, movecard: ((a, b) => this.movecard(a, b, this)) };



        return (
            <div className={"testholders-css"} >
                <gamecontext.Provider value={this.getContextValue()}>
                    <Cardholder index={0} />
                    <Cardholder index={1} />
                    <Cardholder index={2} />
                    <Cardholder index={3} />
                </gamecontext.Provider>
                <button onClick={() => this.testInit()}>place test Cards</button>
            </div>
        );
    }

}