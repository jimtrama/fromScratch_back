const express = require("express");
const fs = require("fs");
const cors = require("cors");
const {User} = require("./user");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;


app.use(bodyParser.json());
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

var logger = fs.createWriteStream("data.txt", {
    flags: "a", // 'a' means appending (old data will be preserved)
});

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
    console.log(p);

    if (!p.isOk()) {
        res.send({ error: "Something went wrong" });
        return;
    }
    await writeToFile(p);
    res.send({ success: true });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

async function writeToFile(p) {
    await addLine(JSON.stringify(p));
}



async function addLine(line) {
    // append data to file
    logger.write(line + "\n", function (err) {
        if (err) throw err;
    });
}
