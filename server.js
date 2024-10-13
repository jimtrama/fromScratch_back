const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.get("/participants", (req, res) => {
  const users = [];
  let userStarting = false;
  res.setHeader("Access-Control-Allow-Origin","*")

  const lineReader = require("readline").createInterface({
    input: fs.createReadStream("data.txt"),
  });
  let userCount = 0;

  lineReader.on("line", function (line) {
    if (userStarting) {
      const [key, value] = line.split(":");
      users[userCount][key] = value;
    }
    if (line[0] === "<") {
      userStarting = true;
      users.push({});
    }
    if (line[0] === ">") {
      userStarting = false;
      userCount++;
    }
  });

  lineReader.on("close", function () {
    res.send({ results: users });
  });
});

app.post("/participant", (req, res) => {
  res.send("Hello, World!");
});

app.get("/", (req, res) => {

    const firstName = "kati";
    const lastName = "allo";
    const gitlab = "git";
    const kaggle = "kaggle";
    const today = new Date();
    addLine("<");
    addLine(`firstName:${firstName}`);
    addLine(`lastName:${lastName}`);
    addLine(`gitlab:${gitlab}`);
    addLine(`kaggle:${kaggle}`);
    addLine(`registrationDate:${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`);
    addLine(">");

  res.send("Hello, World!");
});

function addLine(line) {
  // append data to file
  fs.appendFile(
    "data.txt",
    line+'\n',
    "utf8",
    // callback function
    function (err) {
      if (err) throw err;
    }
  );
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
