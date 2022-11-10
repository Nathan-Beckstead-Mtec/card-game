import React, { useEffect } from "react";
import Card from "./Card2";

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
        this.index = index;
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
        thus.context.movecard(thus.index,data);

            console.log("event:");
            console.log(e);
            console.log("data:");
            console.log(data);
        console.groupEnd("drop");
    }

    render() {

        let heldTEST = this.context.cards[this.index];

        let card = <></>;
        if(heldTEST != null){
            card = <Card id={heldTEST} />
        }

        let droppable = heldTEST == null;

        return (
            <div className="card-holder" style={{ height: this.height, width: this.width }}
                onDrop={droppable ? (e => this.handler_drop(e,this)) : null}
                onDragOver={droppable ? (this.handler_dragover) : null}
            >
                {card}
                <p>holding: {heldTEST}</p>
            </div>
        );
    }
}