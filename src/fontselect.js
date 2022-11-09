import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";
import { useState } from "react";
import ReactDOM from "react-dom";



export default function FontSelect(){
    
    const [font, setFont] = useState(".");
    
    /*
edo
keyVirtue numbers
stiff brush
painp___

*/

    // const fontlist = [
    //     "./stiffbrushjk.otf",
    //     "./edo.ttf",
    //     "./PAINP___.TTF"
    // ];



const fontlist = [
    "./edo.ttf",
    "./PAINP___.TTF",
    "./valium.ttf",
    "./Travelling.ttf",
    "./Lovecraft's Diary.ttf",
    "./Gypsy Curse.ttf",
    "./fonts.txt",
    "./floki-Hard.ttf",
    "./JinxedWizards.ttf",
    "./Lycanthrope.ttf",
    "./PixelsRUs.ttf",
    "./Frank Knows.ttf",
    "./Runes.ttf",
    "./MetalMania-Regular.ttf",
    "./RobotY.ttf",
    "./Coraline's Cat.ttf",
    "./October Crow.ttf",
    "./PixelByzantine.ttf"
];



    // const fontlist = [
    //     "./KeyVirtue.otf",
    //     "./stiffbrushjk.otf",
    //     "./edo.ttf",
    //     "./Overdrive Sunset.otf",
    //     "./PAINP___.TTF",
    //     "./Boldace Brush.otf",
    //     "./fonts.txt",
    //     "./Tajamuka Script.ttf",
    //     "./KeyVirtue.ttf",
    //     "./edosz.ttf"
    // ];

    let optionsJSX = fontlist.map(elem => {
        return(
            <option value={elem} >{elem}</option>
        );
    });

    function changedSelected(e){
        setFont(e.target.value);
    }


    return(
        <div>
            <select id="fontselecter" name="font" onInput={changedSelected}>
                {optionsJSX}
            </select>
            <style>
                @font-face {"{"}
                    font-family: selected;
                    src: url("./fonts/{font}");
                {"}"}
            </style>
        </div>
    );


}

