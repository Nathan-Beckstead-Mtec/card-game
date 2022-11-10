import React, { useState } from "react";
import Cardholder from "./Cardholder";

import { gamecontext } from "./context";
import { useContext } from "react"; //not needed if just providing context

export default class Game extends React.Component{

    constructor(){
        super();

        this.state = {};
        this.state.cards = [42, 69, null, null];

    }


    movecard(index,id,thus){
        //moves the card (selected by id) to index of this.state.cards from whereever it was before
        //this function is not to create or destroy cards
        //callers: (when a card is dropped onto a cardholder)


        if(thus.state.cards[index] != null){
            throw Error("Future me: I won't overwrite preexisting card at index:" + index + " with id:"+id);
        }
        if(id == null){
            throw Error("Future me: this might dissappear a card");
        }
        let oldindex = findId(id);
        if (oldindex < 0){
            throw Error("Future me: cannot find old location of card with id:"+ id + " (dont use movecard() to add a new card) or (illegal dragged card)");
        }

        thus.setcard_raw(oldindex, null);
        thus.setcard_raw(index, id, thus);

        function findId(id){
            return thus.state.cards.findIndex(a => a == id);
        }
    }
    setcard_raw(index, id, thus){
        //this is too much power to call directly
        thus.setState((current) => {
            let cards_temp = Array.from(current.cards);
            cards_temp[index] = id;
            return {cards: cards_temp};
        });
    }

    render() {
        let providecontext = { cards: this.state.cards, movecard: ((a,b) => this.movecard(a,b,this))};



        return (
            <div className={"testholders-css"} >
                <gamecontext.Provider value={providecontext}>
                    <Cardholder index={0}/>
                    <Cardholder index={1}/>
                    <Cardholder index={2}/>
                    <Cardholder index={3}/>
                </gamecontext.Provider>
                
            </div>
        );
    }

}