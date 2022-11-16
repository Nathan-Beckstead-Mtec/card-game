const fs = require("fs");
// const allTxt = require("./all.txt");

const argv = process.argv;



function main() {
    if (argv[2] == undefined) {
        console.error("Usage " + argv[0] + " " + argv[1] + " fileToFix.json");
        throw Error("No argument");
        process.exit(1);
    }
    if (! argv[2].toLowerCase().endsWith(".json")) {
        console.error("Usage " + argv[0] + " " + argv[1] + " fileToFix.json");
        throw Error("Not a .json file");
        process.exit(1);
    }



    let fileopener = fs.promises.open(argv[2]);
    fileopener.then(file => {
        let filereader = file.readFile({ encoding: "utf-8" });
        filereader.then(filecontent => {
            writeToNewFile(  mutateData(  JSON.parse(filecontent)));
        });
    }).catch(err => {
        console.error("Mine (prob couldn't open file): " + err);
        throw Error(err);
    });


    function writeToNewFile(dat){
        const newfileName = argv[2].slice(0,-5) + "-normalized.json";
        let writefile = fs.promises.open("./" + newfileName,"w");
        writefile.then(file => {
            file.write(JSON.stringify(dat)).then(data => {
                console.log("bytes written:" + data.bytesWritten);
                file.close();
                process.exit(0);
            });
        }).catch(err => {
            console.error(err);
        });
    }

    function mutateData(dat){
        //input: object
        //returns a deep "copy"


        console.log("Types:");
        console.log({root: dat.constructor.name, child1: dat[0].constructor.name});

        console.group("object mapping");
        let sigils = {};
        let newdat = Array.from(dat.map((thing,index) => {
            let newthing = {};
            newthing.name = thing.name;

            if(thing.cost === "" && thing.attac === "" && thing.health === ""){
                //sigil
                console.log(thing.name + "is now a Sigil");
                newthing.type = "sigil";
                newthing.desc = thing.desc;
                sigils[thing.name] = index;


            }else{
                //animal

                console.log(thing.name + "is now an animal");
                newthing.type = "animal";

                newthing.cost   = Number.parseInt(thing.cost);
                newthing.attac  = Number.parseInt(thing.attac);
                newthing.health = Number.parseInt(thing.health);
                if (0 > newthing.cost){
                    console.log("value of cost was too low (<0) (got:" + newthing.cost + ") for " + newthing.name + ", setting to 0");
                    newthing.cost = 0;
                    // 0,cost
                }
                if (0 > newthing.attac){
                    console.log("value of attac was too low (<0) (got:" + newthing.attac + ") for " + newthing.name + ", setting to 0");
                    newthing.attac = 0;
                    // 0,attac
                }
                if (1 > newthing.health){
                    console.log("value of health was too low (<1) (got:" + newthing.health + ") for " + newthing.name + ", setting to 1");
                    newthing.health = 1;
                    // 1,health
                }
                newthing.sigils = (thing.sigils === "") ? [] : thing.sigils.split(",").map(raw => raw.trim()); //delimiter: "," and trim white space

            }
            return newthing;
        }));
        console.groupEnd("object mapping");
        
        
        
        // put link to sigils index into the animals that use them

        console.group("sigil mapping");
            console.group("sigils");
            console.log(sigils);
            console.groupEnd("sigils");

        newdat = newdat.map(thing => {
            if(thing.type == "sigil"){
                return thing;
            }
            //animal
            thing.sigils = thing.sigils.map(nameOfSigil => {
                if (sigils[nameOfSigil] == undefined){
                    console.log("Could not find " + nameOfSigil + " for " + thing.type + " named " + thing.name + "ignoring");
                    return null;
                }
                return {name: nameOfSigil,index:sigils[nameOfSigil]};
            }).filter(keepme => keepme != null);

            return thing;
        })
        // */

            console.log("no lines here == good");
        console.groupEnd("sigil mapping");
        console.log("final (ignoring svg):")
            console.group("final");
            console.log(newdat);
            console.groupEnd("final");


        if (newdat[0].svg != undefined){
            console.group("adding svg");
            newthing = newthing.map((curr,index) => Object.assign(curr, thing[index].svg));
            console.groupEnd("adding svg");
        }



        return newdat; //returns a deep "copy"
    }

}
main();