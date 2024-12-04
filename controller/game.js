const { findRFID } = require("../service/database/RFIDService");
const { generate } = require("../service/jwtService");
const socket = require("../socket");

const helloworld = (req, res) => {
  const formData = req.body;
  const ans = ["72", "101", "108", "108", "111", "87", "111", "114", "108", "100"];
  if (formData["answer"].join(",") === ans.join(",")) {
    res.redirect('/sign-up');
    return;
  }
  res.send({ message: "wrong answer" })
}

const morning = (req, res) => {
  const formData = req.body;
  const ans = "helloworld";
  if (formData["answer"].replace(/\s/g, '').toLowerCase() === ans) {
    res.send({ status: 200, storyCode: process.env.LEVEL_1_STORY_CODE });
    return;
  }
  res.send({ status: 400 });
}

const pascal = (req, res) => {
  const formData = req.body;
  const ans = "↑↑↓↓↑↑↓↑↓↓↑";
  if (formData["answer"] === ans) {
    res.send({ status: 200, storyCode: process.env.LEVEL_2_STORY_CODE });
    return;
  }
  res.send({ status: 400 });
}

const getVoteUrl = (req, res) => {
  const basicUrl = process.env.BASIC_URL;
  const token = generate("10m");
  const voteUrl = `${basicUrl}/majority/player?token=${token}`;
  res.send({ status: 200, url: voteUrl });
}

const swipeRFID = async (req, res) => {
  try {
    const { uid } = req.body;
    const rfids = await findRFID({ uid, type: "card" });
    if (rfids.length === 0) {
      res.send({ status: 404 })
      return;
    }

    global.swipeRFID = true;
    res.send({ status: 200 })
  } catch (error) {
    console.error(error);
    res.send({ status: 500 })
  }
}

const detectRFID = async (req, res) => {
  try {
    const { uid, tagPresent } = req.body;

    if (!tagPresent) {
      socket.io.emit("readChip/absent", { url: "/read-chip/idle" });
    } else {
      const rfids = await findRFID({ uid });
      if (rfids.length === 0) {
        res.send({ status: 404 })
        return;
      }

      if (rfids[0].type !== "tag") {
        res.send({ status: 400 })
        return;
      }
      socket.io.emit("readChip/present", { url: "/read-chip/data" });
    }

    res.send({ status: 200 })
  } catch (error) {
    console.error(error);
    res.send({ status: 500 })
  }
}

const hex = (req, res) => {
  const formData = req.body;
  const ans = "學活403";
  if (formData["answer"] === ans) {
    res.send({ status: 200, storyCode: process.env.LEVEL_5_STORY_CODE });
    return;
  }
  res.send({ status: 400 });
}

const snake = (req, res) => {
  const formData = req.body;
  let touchedWall;
  if (formData["tailLen"] !== 7) {
    res.send({ status: 400 });
    return;
  }
  if (formData["headY"] < 0) {
    touchedWall = "Top";
  } else if (formData["headY"] >= 20) {
    touchedWall = "Bottom";
  }
  if (formData["headX"] < 0) {
    touchedWall = "Left";
  } else if (formData["headX"] >= 20) {
    touchedWall = "Right";
  }
  if (!touchedWall) {
    res.send({ status: 400 });
    return;
  }
  res.send({ status: 200, touchedWall, storyCode: process.env.LEVEL_14_STORY_CODE });
}

const tomb = (req, res) => {
  const formData = req.body;
  const ans = "此生摯愛";
  if (formData["answer"] === ans) {
    res.send({ status: 200, storyCode: process.env.LEVEL_6_STORY_CODE });
    return;
  }
  res.send({ status: 400 });
}

const maze = (req, res) => {
  const formData = req.body;

  if (!formData["pass"]) {
    res.send({ status: 400 });
    return;
  }
  if (!formData["noteClicked"]) {
    res.send({ status: 400 });
    return;
  }
  if (!(formData["moveCount"] >= formData["mazeSideLen"] * 2)) {
    res.send({ status: 400 });
    return;
  }
  res.send({ status: 200, storyCode: process.env.LEVEL_16_STORY_CODE });
}

const graduate = (req, res) => {
  const formData = req.body;
  const ans = "portal";
  if (formData["answer"] === ans) {
    res.send({ status: 200, storyCode: process.env.LEVEL_9_STORY_CODE });
    return;
  }
  res.send({ status: 400 });
}

const doom = (req, res) => {
  const formData = req.body;
  const ans = "世界注定毀滅";
  if (formData["answer"] === ans) {
    res.send({ status: 200, storyCode: process.env.LEVEL_10_STORY_CODE });
    return;
  }
  res.send({ status: 400 });
}

const handouts = (req, res) => {
  const formData = req.body;
  const ans = "吾乃漆黑之元祖";
  if (formData["answer"] === ans) {
    res.send({ status: 200, storyCode: process.env.LEVEL_15_STORY_CODE });
    return;
  }
  res.send({ status: 400 });
}


module.exports = {
  helloworld,
  morning,
  pascal,
  getVoteUrl,
  swipeRFID,
  detectRFID,
  hex,
  snake,
  tomb,
  maze,
  graduate,
  doom,
  handouts
}
