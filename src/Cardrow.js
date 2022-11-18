import React, { Component } from "react";
import Cardholder from "./Cardholder";
import { gamecontext } from "./context";




export default class CardRow extends React.Component{
    
    static contextType = gamecontext;
    
    constructor(){
        super();
    }


    render(){
        //[{type: "table", owner: 1, index:}]
        // let cardholderJSX = this.state.cardholders.map((val, index) => <Cardholder index={index} />);
        // let heldId = this.context.cards[this.props.index];
        console.log("Cardrow.props:");
        console.log(this.props);
        console.log("Cardrow.context:");
        console.log(this.context);
        let myindexes = this.props.data.map(curr => curr.index);
        let mytype = this.props.type;
        let myowner = this.props.owner;
        //this object is a slave :[

        let cardholdersJSX = myindexes.map(val => <Cardholder index={val} owner={myowner}/>);


        return (
            <div className="Cardrow">
                {cardholdersJSX}
            </div>
        );
    }

}