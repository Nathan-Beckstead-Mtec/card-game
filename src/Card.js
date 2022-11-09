import React from "react";
import ReactDOM from "react-dom";
import './css/card.css';

export default class Card extends React.Component {
    constructor(props){
        super();

        //no idea what props is but let it slide
        //props : data passed to constructor
        //state : managed within the componenet

        this.state = {};
        this.state.health = props.health;
        this.state.attac  = props.attac;
        this.name = props.name;
        this.cost = props.cost;
        this.state.imgUrl = props.imgUrl;
        console.table(this.state);
        this.state.cssunit = "0px";
    }


    componentDidMount() {
        //fired when we first are inserted into DOM
        //yes it triggers render twice but it wont display the first to user
        let me = ReactDOM.findDOMNode(this);
        let cont = me.parentNode;
        // console.log(cont);
        const ratio = 5 / 7;
        let unit = (Math.min(cont.clientHeight , cont.clientWidth / ratio) / 100).toFixed(4) + "px";
        // this.setState({cssunit: unit});
        cont.style.setProperty("--magic",unit);

        function resize(input){
            // console.log(input);
            // input[0].contentRect.height
            // input[0].contentRect.width
            if (input[0].target == undefined){
                console.info(input);
                return;
            }
            const ratio = 5 / 7;
            let unit = (Math.min(input[0].contentRect.height , input[0].contentRect.width / ratio) / 100).toFixed(4) + "px";
            input[0].target.style.setProperty("--magic",unit);
        }
        const scryglass = new ResizeObserver(resize);
        scryglass.observe(cont);
    }

    render() { //required by React.component
        return (
            <div className="card">
                <div className="card-title">{this.name}</div>
                {/* <Cost value={this.cost} /> */}
                <div className="imgbox">
                    <Cost value={this.cost} />
                    <Pic url={this.state.imgUrl} />
                </div>
                <div className="content">
                    <Attac value={this.state.attac} />
                    <div className="sigils">

                    </div>
                    <Health value={this.state.health} />
                </div>
            </div>
        );
    }
}

function Pic({url}){
    return (
        <object data={url} type="image/svg+xml"></object>
    );
}

function Attac({value}){
    return (
        <div className="attac stat">
            <svg width="64px" height="64px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
	            <path d="M14.922 14.21V197.01c105.426 65.67 171.442 156.49 109.213 299.017 71.456-76.97 99.707-180.437 72.418-273.904l-43.217 28.034c-8.593-32.65-25.23-63.915-44.04-88.097-18.808-24.182-35.91-41.747-54.142-58.317l12.57-13.83c26.36 23.958 50.918 50.426 71.26 81.727 122.584 56.688 209.387 144.066 155.1 301.027 65.208-82.512 85.325-187.03 50.81-277.992l-41.466 30.37c-9.225-26.42-23.88-51.128-43.455-74.562-31.626-34.863-68.584-59.443-108.29-79.904l8.56-16.61c46.226 23.82 90.127 53.793 126.312 98.87C399.033 189.56 479.498 260.64 456.44 409.59c49.442-93.163 50.723-200.15.585-283.248l-35.04 38.547C379.276 89.6 288.66 35.463 159.76 14.21H14.924z"/>
            </svg>
            <p className="paint">{value}</p>
        </div>
    )
    // fill="#000"
}


function Health({value}){
    return (
        <div className="health stat">
            <svg width="64px" height="64px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M 363.656 30.03 C 322.161 30.594 280.022 52.185 252.812 99.312 C 210.9 -18.458 16.32 23.022 20.812 163.812 C 25.494 310.409 235.295 395.852 257.875 480.125 C 278.541 403.012 498.627 304.305 494.219 163.812 C 491.569 79.454 428.387 29.152 363.655 30.032 L 363.656 30.03 Z"/>
            </svg>
            <p className="paint">{value}</p>
        </div>
    )
    //fill="#000"
}

function Cost({value}) {
    const drop = (
        <svg width="256px" height="512px" viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M 135.85 40.344 C 106.106 213.202 17.6 248.03 17.6 369.22 C 17.6 430.024 77.706 474.72 135.85 474.72 C 195.3 474.72 251.787 432.917 251.787 375.187 C 251.787 258.855 166.587 212.875 135.851 40.344 L 135.85 40.344 Z M 77.57 257.438 C 49.607 332.968 72.465 412.005 131.82 436.813 C 147.005 443.161 163.544 444.527 179.725 443.093 C 63.591 492.88 -6.111 363.277 77.567 257.437 L 77.57 257.438 Z"/>
        </svg>
    );
    //fill="#000"

    // let jsx = new Array(value ?? 0).fill(<object data="./SVG/blood-drop.svg" type="image/svg+xml"></object>);
    let jsx = [];
    for(let i = 0; i < value; i++){
        // jsx.push(<object data="./SVG/blood-drop.svg" type="image/svg+xml"></object>);
        jsx.push(drop);
    }

    return (
        <div className="cost">
            {jsx}
        </div>
    );
}