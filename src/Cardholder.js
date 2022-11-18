import React, { useEffect } from "react";
import Card from "./Card";

import { gamecontext } from "./context";
import { useContext } from "react";


export default class Cardholder extends React.Component {

    static contextType = gamecontext;

    constructor({ children, height = "400px", width = "300px", index}) {
        super();

        this.state = {};
        this.kiddos = children; //cough cough if this gets refactored I'll quit
        this.height = height;
        this.width = width;
        
        // this.index = index;

        // useEffect(updateContextVars,[context]);
    }


    handler_dragover(e) {
        e.preventDefault();
        // e.dataTransfer.dropEffect = "move"; //redundant

        // console.groupCollapsed("dragOver");
        //     console.log(e);
        // console.groupEnd("dragOver");
    }
    handler_drop(e,thus) {
        console.group("drop");
        
            console.log("this:");
            console.log(this);
            console.log("thus:");
            console.log(thus);
        e.preventDefault();
        let data = e.dataTransfer.getData("text/plain");
        // thus.setState({ heldId: data });
        thus.context.movecard(thus.props.index,data);

            console.log("event:");
            console.log(e);
            console.log("data:");
            console.log(data);
        console.groupEnd("drop");
    }

    render() {

        // let heldId = this.context.cards[this.index];
        let heldId = this.context.cards[this.props.index];
        console.log("cardholder with index: " + this.props.index + " is holding: " + heldId);

        let card = <></>;
        if(heldId != null){
            card = <Card id={heldId} />
        }

        let droppable = heldId == null;

        return (
            <div className="card-holder" style={{ height: this.height, width: this.width }}
                onDrop={droppable ? (e => this.handler_drop(e,this)) : null}
                onDragOver={droppable ? (this.handler_dragover) : null}
                owner={this.props.owner.toString()}
            >
                {card}
                {/* <p>holding: {heldId}</p> */}
            </div>
        );
    }
}