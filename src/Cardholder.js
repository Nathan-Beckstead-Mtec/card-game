import React, { useEffect } from "react";
import ReactDOM from "react-dom";
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


    componentDidMount(){
        
        return;
        console.error("this shouldnt run");

        let me = ReactDOM.findDOMNode(this);
        const ratio = 5 / 7;
        
        let updateFunc;
        let updateFuncScry;

        if (this.props.type == "table"){
            //change height based on width

            updateFunc = (me, ratio) => {
                // let cont = me.parentNode;
                // console.log(cont);
                // let unit = (Math.min(cont.clientHeight , cont.clientWidth / ratio) / 100).toFixed(4) + "px";
                let height = (me.clientWidth / ratio ).toFixed(4) + "px";
                // this.setState({cssunit: unit});
                me.style.setProperty("height",height);
                
                //stolen from disabled Card.js
                me.style.setProperty("--magic",height);
            };
            updateFuncScry = (input, ratio) => {
                // console.log(input);
                // input[0].contentRect.height
                // input[0].contentRect.width
                if (input[0].target == undefined){
                    console.info(input);
                    return;
                }
                let height = (input[0].contentRect.width / ratio ).toFixed(4) + "px";
                me.style.setProperty("height",height);
            };

        } else if (this.props.type == "hand"){
            //change width based on height

            updateFunc = (me, ratio) => {
                let width = (me.clientHeight * ratio).toFixed(4) + "px";
                me.style.setProperty("width",width);
            };
            updateFuncScry = (input, ratio) => {
                // console.log(input);
                // input[0].contentRect.height
                // input[0].contentRect.width
                if (input[0].target == undefined){
                    console.info(input);
                    return;
                }
                let width = (input[0].contentRect.height * ratio ).toFixed(4) + "px";
                me.style.setProperty("width",width);

                //stolen from disabled Card.js
                let unit = (input[0].contentRect.height / 100).toFixed(4) + "px";
                me.style.setProperty("--magic",unit);
            };
        } else {
            console.error(`this card holder is neither of type "table" or "hand", got props: `);
            console.warn(this.props);
        }

        updateFunc(me,ratio);

        const scryglass = new ResizeObserver((e) => updateFuncScry(e,ratio));
        scryglass.observe(me);
        window.addEventListener("resize", () => updateFunc(me,ratio));
    }



    handler_dragover(e) {
        e.preventDefault();
        // e.dataTransfer.dropEffect = "move"; //redundant

        // console.groupCollapsed("dragOver");
        //     console.log(e);
        // console.groupEnd("dragOver");
    }
    handler_drop(e,thus) {
        console.groupCollapsed("drop");
        
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
        // console.log("cardholder with index: " + this.props.index + " is holding: " + heldId);


        let card = <Card id={heldId} />
        
        let droppable = heldId == null;


        //style={{ height: this.height, width: this.width }}
        return (
            <div className={"card-holder" + (heldId != null ? " hascard" : "")}
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