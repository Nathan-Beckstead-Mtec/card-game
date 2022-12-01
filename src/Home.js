import React from "react";
import { Link } from "react-router-dom";

import './css/home.css';



export default function Home({url}){
    return (
        <div className="main">
            <div className="title">
                <h1>A Card Game That Happens to Look Like <a target="_blank" href="https://www.inscryption.com/">Inscryption</a></h1>
                <p>Now with 97% less features than the competitor!!!</p>
            </div>
            <div className="options">
                <ul>
                    <li><h1><Link to="/game">Play game</Link></h1></li>
                </ul>
            </div>
        </div>
    );
}
