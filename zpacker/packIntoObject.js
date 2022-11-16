const fs = require("fs");
// const allTxt = require("./all.txt");

fs.promises.open("./all.txt","r")
    .then(file => {
        file.readFile({encoding: "utf-8"}).then(readFile => {
            console.log("read all.txt got:");
            console.log(JSON.stringify(readFile.split("\n")));
            linesFromAllTxt(readFile.split("\n"));
        })
    })
    .catch(err => {
        console.error("Mine: (could not open all.txt) " + err);
    });



function linesFromAllTxt(lines){ //async call back for alltext.open()
    let openPromises = [];

    lines.forEach(line => {
        console.log("opening: ./" + line);
        openPromises.push(fs.promises.open("./" + line,"r"));
    });
    
    Promise.all(openPromises)
        .then(data => {
            var SVGObj ={};
            
            let readPromises = [];
            data.forEach(file => {
                readPromises.push(file.readFile({encoding: "utf-8"}));
            });
            Promise.all(readPromises)
                .then(data => {
                    data.forEach((content, index) => {

                        SVGObj[index] = {};
                        SVGObj[index].svg = content;
                    })

                    //write data to file
                    let writefile = fs.promises.open("./svgobj.json","w");
                    writefile.then(file => {
                        file.write(JSON.stringify(SVGObj)).then(data => {
                            console.log("bytes written:" + data.bytesWritten);
                            file.close();
                        });
                })
                .catch(reason => {
                    console.error("Mine: (line 44) " + reason);
                });
            })
        })
        .catch(reason => {
            console.error("Mine: (propably could not open file)(line 49) " + reason);
        });
}



