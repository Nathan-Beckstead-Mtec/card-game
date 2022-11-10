import React, { useState } from "react";
import Cardholder from "./Cardholder";

import { gamecontext } from "./context";
import { useContext } from "react"; //not needed if just providing context

export default class Game extends React.Component{

    constructor(){
        super();

        this.state = {};
        this.state.cards = [42, 69, null, null];

        this.providecontext = {};
        this.updateProvidedContext();
    }


    movecard(index,id){
        //moves the card (selected by id) to index of this.state.cards from whereever it was before
        //this function is not to create or destroy cards
        //callers: (when a card is dropped onto a cardholder)


        if(this.state.cards[index] != null){
            throw Error("Future me: I won't overwrite preexisting card at index:" + index + " with id:"+id);
        }
        if(id == null){
            throw Error("Future me: this might dissappear a card");
        }
        let oldindex = findId(id);
        if (oldindex < 0){
            throw Error("Future me: cannot find old location of card with id:"+ id + " (dont use movecard() to add a new card) or (illegal dragged card)");
        }

        this.setcard_raw(oldindex, null);
        this.setcard_raw(index, id);

        function findId(id){
            return this.state.cards.findindexof(a => a == id);
        }
    }
    setcard_raw(index,id = null){
        //this is too much power to call directly
        this.setState((current) => {
            let cards_temp = Array.from(current.cards);
            cards_temp[index] = id;
            return {cards: cards_temp};
        });
    }

    updateProvidedContext(){
        this.providecontext = { cards: this.state.cards, setcard: this.movecard};
    }

    render() {
        // let providecontext = { cards: this.state.cards, setcard: this.movecard};



        return (
            <div className={"testholders"} >
                <gamecontext.Provider value={this.providecontext}>
                    <Cardholder index={0}/>
                    <Cardholder index={1}/>
                    <Cardholder index={2}/>
                    <Cardholder index={3}/>
                </gamecontext.Provider>

            </div>
        );
    }

}