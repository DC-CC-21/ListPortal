//database
const dotenv = require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGO_URI.replace("ListPortal", "ListPortal");
const client = new MongoClient(uri);
const base = client.db("ListPortal").collection("ListPortal");

// import required modules
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

// create app
const app = express();
const path = require("path");

// define what the app will use
app.use(express.static("client/build"));
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "html");
app.use(bodyParser.json());
app.options("*", cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Pre", "application/json;charset=utf-8");
  next();
});

//home page
app.get("/", sendFile);
// app.get("/index.html", sendFile);
app.get("/accountPage", sendFile);
app.get("/itemListPage", sendFile);

function sendFile(req, res, next) {
  console.log("file");
  res.setHeader("Content-type", "text/html");
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  // next()
}

app.get("/homePage", getHomePage);

async function getHomePage(req, res) {
  console.log(req.query);
  console.log("homePage");

  if (req.query.user) {
    await base.findOne({ username: req.query.user }).then(async (data) => {
      if (data) {
        await base.findOne({ _id: "LISTS" }).then((lists) => {
          let usersLists = [];
          data.lists.forEach((key) => {
            usersLists.push([key, lists.value[key]]);
          });

          let imports = [];
          Object.keys(lists.value).forEach((key) => {
            if (!data.lists.includes(key)) {
              imports.push([key, lists.value[key]]);
            }
          });
          console.log(data);

          res.json({
            usersLists: usersLists,
            imports: imports,
            requests: data.requests,
          });
        });
      } else {
        res.json({ usersLists: {}, imports: {} });
      }
    });
  } else {
    res.json({ usersLists: {}, imports: {} });
  }
}

app.post("/homePage", async (req, res) => {
  // console.log(req.query);
  // console.log(req.body);
  // return getHomePage(req, res)
  let counter = 0;
  await base.findOne({ _id: "LISTS" }).then(async (data) => {
    // > generate a new list code
    let newCode;
    if (data.value) {
      let codes = Object.keys(data.value);
      newCode = codes[0];
      while (codes.includes(newCode)) {
        newCode = genCode(7);
        console.log(newCode, counter);

        // escape in case it makes an infinite loop
        if (counter > 5) {
          res.json({ fail: "code" });
          break;
        }

        counter += 1;
      }
    } else {
      newCode = genCode(7);
    }

    // > insert new list to overall list
    // gather data from form
    let newData = {
      image: req.body.image,
      name: req.body.listName,
      data: [],
      owner: req.query.user,
    };

    // create the query to push the data into the location
    let update = {
      $set: {},
    };
    update["$set"][`value.${newCode}`] = newData;

    // update the database
    await base
      .updateOne({ _id: "LISTS" }, update)
      .then(() => {
        console.log("Update Successful");
      })
      .catch((error) => {
        console.error("Update failed", error);
        return res.sendStatus(500);
      });

    // > update users lists
    update = {
      $push: {},
    };
    update["$push"][`lists`] = newCode;

    await base
      .updateOne({ username: req.query.user }, update)
      .then(() => {
        console.log("Update Successful");
        getHomePage(req, res);
      })
      .catch((error) => {
        console.error("Update failed", error);
      });
  });
});

app.delete("/homePage", async (req, res) => {
  if (!req.query.user) {
    console.log("No user found");
    res.send(404);
    return;
  }
  console.log(
    "Delete",
    req.query.list,
    "from user",
    req.query.user,
    "owner",
    req.query.owner
  );

  let update = {
    $pull: {
      lists: req.query.list,
    },
  };

  if (req.query.user === req.query.owner) {
    let _delete = {
      $unset: {},
    };
    _delete["$unset"][`value.${req.query.list}`] = "";
    await base.updateOne({ _id: "LISTS" }, _delete).then((data) => {
      console.log("success");
    });
  }

  // return getHomePage(req, res)
  await base.updateOne({ username: req.query.user }, update).then((data) => {
    console.log(data);
    getHomePage(req, res);
  });
});

app.post("/addItem", async (req, res) => {
  // console.log(req.body)
  // console.log(req.query)

  let update = {
    $push: {},
  };
  update["$push"][`value.${req.query.list}.data`] = req.body;
  // console.log(update)
  await base.updateOne({ _id: "LISTS" }, update).then((data) => {
    console.log(data);
    itemList(req, res);
    // res.sendStatus(200)
  });
});

app.delete("/addItem", async (req, res) => {
  console.log(req.body);
  console.log(req.query);

  let update = {
    $pull: {},
  };
  update["$pull"][`value.${req.query.list}.data`] = {
    itemName: req.query.item,
  };

  await base
    .updateOne({ _id: "LISTS" }, update)
    .then(() => {
      console.log("Update Successful");
      itemList(req, res);
    })
    .catch((error) => {
      console.error("Update failed", error);
    });
});

app.get("/itemList", itemList);

async function itemList(req, res) {
  console.log(req.query.list);
  await base.findOne({ _id: "LISTS" }).then((data) => {
    res.json(data.value[req.query.list]);
  });
}

app.get("/accounts", (req, res) => {
  // console.log(req.cookies.user);
  // res.json(accountData);
  res.sendStatus(200);
});

app.post("/accounts", async (req, res) => {
  console.log(req.body);
  console.log(req.params);
  console.log(req.query);
  if (req.query.type == "login") {
    loginToAccount(req, res);
  } else if (req.query.type == "create") {
    createAccount(req, res);
  }
});

async function createAccount(req, res) {
  console.log("create");
  await base.findOne({ username: req.body.username }).then(async (data) => {
    console.log(data);
    //check if username already exists
    if (data != null) {
      console.log("Username already exists");
      res.json({
        invalid: true,
      });
      return;
    } else {
      const data = {
        username: req.body.username,
        pword: req.body.pword,
        lists: [],
        pendingLists: {},
        requests: {},
      };
      await base.insertOne(data).then((data) => {
        console.log(data);
        res.sendStatus(200);
      });
    }
  });
}

async function loginToAccount(req, res) {
  console.log("login");

  await base
    .findOne({ username: req.body.username, pword: req.body.pword })
    .then((data) => {
      console.log(data);
      if (data != null) {
        console.log("Data found");
        res.send(200);
      } else {
        console.log("Invalid credentials");
        res.json({
          invalid: true,
        });
      }
    });
}

app.post("/importList", async (req, res) => {
  console.log(req.body);
  console.log(req.query);

  // update users pending lists
  let update = {
    $set: {},
  };
  update["$set"][`pendingLists.${req.body.listId}`] = [
    req.body.owner,
    req.body.listName,
  ];
  console.log(update);
  await base
    .updateOne({ username: req.query.user }, update)
    .then(async (data) => {
      update = {
        $set: {},
      };
      update["$set"][`requests.${req.body.listId}`] = [
        req.query.user,
        req.body.listName,
      ];
      console.log(update);
      await base
        .updateOne({ username: req.body.owner }, update)
        .then((data) => {
          res.sendStatus(200);
        });
    });
});

app.put("/requestList", (req, res) => {
  console.log(req.body);
  console.log(req.query);
  if (req.query.type === "block") {
    blockRequest(req, res);
  } else if (req.query.type === "accept") {
    acceptRequest(req, res);
  } else {
    res.sendStatus(500);
  }
});

async function blockRequest(req, res) {
  let update = {
    $unset: {},
  };
  update["$unset"][`requests.${req.body.code}`] = req.body.list;
  console.log("up1", update);
  await base.updateOne({ username: req.query.user}, update).then(async () => {
    update = {
      $unset: {},
    };
    update["$unset"][`pendingLists.${req.body.code}`] = [
      req.query.user,
      req.body.list[1],
    ];
    console.log("up2", update);
    console.log(data)
    await base.updateOne({ username: req.body.list[0] }, update).then(() => {
      getHomePage(req, res)
    });
  });
}

async function acceptRequest(req, res) {
  let update = {
    $unset: {},
  };
  update["$unset"][`requests.${req.body.code}`] = req.body.list;
  console.log("up1", update);
  await base.updateOne({ username: req.query.user}, update).then(async () => {
    update = {
      $unset: {},
      $push:{}
    };
    update["$unset"][`pendingLists.${req.body.code}`] = [
      req.query.user,
      req.body.list[1],
    ];
    update["$push"][`lists`] = req.body.code;
    console.log("up2", update);
    await base.updateOne({ username: req.body.list[0] }, update).then(() => {
      getHomePage(req, res)
    });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server started on port: ", PORT);
});

function genCode(len) {
  let options = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let newCode = "";
  for (let i = 0; i < len; i++) {
    newCode += options[~~(Math.random() * (options.length - 1))];
  }
  return newCode;
}
