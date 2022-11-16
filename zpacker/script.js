// import SVG from "./obj.json" assert {type: "json"};
let SVG;
getOBJ("./obj.json").then(data => {
    SVG = data;
    console.log(typeof SVG);
    load();
});


async function getOBJ(url){
    const decoder = new TextDecoder("utf-8");
    let response = await fetch(url);
    // console.log(response);
    let reader = response.body.getReader();

    let result = "";
    let outputOBJ = await reader.read().then((a) => read(a,decoder));
    
    async function read({done,value},NSA){
        // console.log({done: done, value: value, NSA: NSA});
        let decodedBit = NSA.decode(value, {stream: true});
        // console.log("read: ");
        // console.log(decodedBit);
        result += value ? decodedBit : "";
        if (done){
            // console.info(result);
            return JSON.parse(result);
            // return;
        }
        // console.log("need to read more");
        let readmore = await reader.read().then((a) => read(a,NSA));
        return readmore;
    }
    return outputOBJ;
}


function getOBJ2 (url){
    fetch(url).then(data =>{
        data.json().then(json =>{
            return json;
        })
//                                me after seeing this :/
    })
}



function load(){
    let selector = document.getElementById("svgSelect");
    Object.keys(SVG).forEach(element => {
        let option = document.createElement("option");
        option.setAttribute("value", element);
        option.textContent = element;

        selector.appendChild(option);
    });
    selector.onchange = changed;
}


function changed(e){
    let previewNum = document.getElementById("SVGpreviewNum");
    let preview = document.getElementById("SVGpreview");

    preview.innerHTML = SVG[e.target.value].svg;
    previewNum.textContent = e.target.value;
}



