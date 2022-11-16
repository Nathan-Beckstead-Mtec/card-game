const fs = require("fs");
// const allTxt = require("./all.txt");

const argv = process.argv;

if (argv[2] == undefined || argv[3] == undefined){
    console.error("Usage node mergeJson.js file1.json file2.json");
    throw Error("Usage");
}


let files = [fs.promises.open(argv[2]),fs.promises.open(argv[3])] ;
Promise.all(files)
    .then(data => {
        let readPromises = [data[0].readFile({encoding: "utf-8"}), data[1].readFile({encoding: "utf-8"})];
        Promise.all(readPromises).then(data =>{
            handle(data);
        })
    })
    .catch(err => {
        console.error("Mine: (can't open file?) " + err);
    });

function handle([prea,preb]){
    let atemp = JSON.parse(prea);
    // b = JSON.parse(b);
    let a;
    let b;
    if (atemp[0].svg === undefined){
        //swap
        a = JSON.parse(preb);
        b = JSON.parse(prea);
    } else {
        a = JSON.parse(prea);// i Know this is wastefull after just parsing it but this is to stop pass by refrence bugs
        b = JSON.parse(preb);
    }
    //a == svg
    //b == stats
    console.log(b);
    console.log({a: typeof a, b: typeof b, bkey: Object.keys(b)[0]});
    
    //a is technically an object so a.map doesn't work :[
    let finalObj = [];
    Object.keys(a).forEach((elem,index) => {
        finalObj[index] = Object.assign(b[elem],a[index]);
        //Object.assign(a,b) == writes all of b's key-value pairs onto a (b overwrites)
    });
    
    let writefile = fs.promises.open("./cardPack.json","w");
    writefile.then(file => {
        file.write(JSON.stringify(finalObj)).then(data => {
            console.log("bytes written:" + data.bytesWritten);
            file.close();
        });
    });
}