const express = require("express");
const fs = require("fs");
const cors = require("cors");
const {User} = require("./user");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;
var logger = fs.createWriteStream("data.txt", {
    flags: "a", // 'a' means appending (old data will be preserved)
});
var usersInDb = [];

app.use(bodyParser.json());
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);


initFromDbUsers();

app.get("/participants", (req, res) => {
    const users = [];

    const lineReader = require("readline").createInterface({
        input: fs.createReadStream("data.txt"),
    });

    lineReader.on("line", function (line) {
      let p = undefined;
      try{
        p = Object.assign(new User(), JSON.parse(line));
        users.push(p);
      }catch(e){
        console.log("Error parsinsing data file");
      }  
    });

    lineReader.on("close", function () {
        res.send({ results: users });
    });
});

app.post("/participant", async (req, res) => {
    console.log("--Req-Body-Log------");
    console.log(req.body);
    console.log("END--Req-Body-Log------");

    const p = new User();
    Object.assign(p, req.body);
    p.thinks = JSON.parse(p.thinks);

    if (!p.isOk()) {
        res.send({ error: "Something went wrong, check the form" });
        return;
    }
    if (useAlreadyExists(p)) {
        res.send({ error: "User already exists, sorry :(" });
        return;
    }
    await writeToFile(p);
    usersInDb.push(p);
    res.send({ success: true });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

function useAlreadyExists(p){
    for(const u of usersInDb){
        if(u.kaggel == p.kaggel || u.gitlab == p.gitlab){
            return true;
        }
    }
    return false;
}

function initFromDbUsers(){
    const lineReader = require("readline").createInterface({
        input: fs.createReadStream("data.txt"),
    });

    lineReader.on("line", function (line) {
      let p = undefined;
      try{
        p = Object.assign(new User(), JSON.parse(line));
        usersInDb.push(p);
      }catch(e){
        console.log("Error parsinsing data file");
      }  
    });

    lineReader.close();
}

async function writeToFile(p) {
    await addLine(JSON.stringify(p));
}



async function addLine(line) {
    // append data to file
    logger.write(line + "\n", function (err) {
        if (err) throw err;
    });
}
