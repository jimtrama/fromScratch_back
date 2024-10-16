const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;
const DILIMITER = ":";

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/participants", (req, res) => {
  const users = [];
  let userStarting = false;

  const lineReader = require("readline").createInterface({
    input: fs.createReadStream("data.txt"),
  });
  let userCount = 0;

  lineReader.on("line", function (line) {
    if (userStarting && (!line.includes("<") || !line.includes("<"))) {
      const d = line.split(":");
      users[userCount][d[0]] = d[1];
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

app.post("/participant", async (req, res) => {
  console.log(req.body);

  const firstName = req.body?.firstName || "";
  const lastName = req.body?.lastName || "";
  const gitlab = req.body?.gitlab || "";
  const kaggle = req.body?.kaggle || "";
  const date = req.body?.date || "";
  console.log(firstName, lastName, gitlab, kaggle,date);

  if (!sanitaze(firstName, lastName, gitlab, kaggle)) {
    res.send({ error: "Something went wrong" });
    return;
  }
  await writeToFile(firstName, lastName, gitlab, kaggle, date);
  res.send({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function writeToFile(firstName, lastName, gitlab, kaggle, date) {
  console.log(firstName, lastName, gitlab, kaggle,date);

  const today = new Date();
  const todayString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  await addLine("<");
  await addLine(`firstName${DILIMITER}${firstName}`);
  await addLine(`lastName${DILIMITER}${lastName}`);
  await addLine(`gitlab${DILIMITER}${gitlab}`);
  await addLine(`kaggle${DILIMITER}${kaggle}`);
  await addLine(`registrationDate${DILIMITER}${todayString}`);
  await addLine(`bdate${DILIMITER}${date}`);
  setTimeout(async ()=>{await addLine(">");},10)
  
}

function sanitaze(f, l, g, k) {
  if (f == "" || f.length > 100 || hasDilimiter(f)) return false;
  if (l == "" || l.length > 100 || hasDilimiter(l)) return false;
  if (g == "" || g.length > 200 || hasDilimiter(g)) return false;
  if (k == "" || k.length > 200 || hasDilimiter(k)) return false;
  return true;
}

function hasDilimiter(s) {
  return s.includes(DILIMITER);
}

async function addLine(line) {
  // append data to file
  await fs.appendFile(
    "data.txt",
    line + "\n",
    "utf8",
    // callback function
    function (err) {
      if (err) throw err;
    }
  );
}
