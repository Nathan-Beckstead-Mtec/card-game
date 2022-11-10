import React from "react";
import ReactDOM from "react-dom";
import './css/card.css';

let DEBUG = false;
export default class Card extends React.Component {
    constructor(props){
        super();

        //no idea what props is but let it slide
        //props : data passed to constructor
        //state : managed within the componenet
        this.CallbackByeDad = props.CallbackByeDad;
        if(DEBUG){
            console.groupCollapsed("card Init");
            console.log("Props:");
            console.log(props);
            console.log(this.state);
            console.groupEnd("card Init");
        }
    }


    componentDidMount() {
        //fired when we first are inserted into DOM
        //yes it triggers render twice but it wont display the first to user

        let me = ReactDOM.findDOMNode(this);

    }

    handler_dragstart(e,id){
        e.dataTransfer.setData("text/plain", id);
        e.dataTransfer.dropEffect = "move";
        console.groupCollapsed("dragStart");
            console.log(id);
            console.log(e);
        console.groupEnd("dragStart");
    }

    // handler_dragend(e,thus){
    //     console.groupCollapsed("dragEnd");
    //         console.log(e);
    //     console.groupEnd("dragEnd");
    //     //onDragEnd   ={e => this.handler_dragend(e,this)}
    // }

    //FIX ME!!!!!
    //NOT ALL CARDS ARE DRAGGABLE
        //ENEMY CARDS
        //NOT MY TURN

    render() { //required by React.component
        let id = this.props.id
        
        return (
            <div className="card2" draggable={true} 
                onDragStart ={e => this.handler_dragstart(e,id)}
                
            >
                <h4>fake card</h4>
                <p>to test drag & drop</p>
                <p>{id.toString()}</p>
            </div>
        );
    }
}

