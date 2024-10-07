const { findRFID } = require("../service/database/RFIDService");
const { generate } = require("../service/jwtService");
const socket = require("../socket");

const helloworld = (req, res) => {
  const formData = req.body;
  const ans = ["72", "101", "108", "108", "111", "87", "111", "114", "108", "100"];
  if (formData["answer"].join(",") === ans.join(",")) {
    res.redirect('/signUp');
    return;
  }
  res.send({ message: "wrong answer" })
}

const pascal = (req, res) => {
  const formData = req.body;
  const ans = "↑↑↓↓↑↑↓↑↓↓↑";
  if (formData["answer"] === ans) {
    res.send({ status: 200, storyCode: "SXHOO" });
    return;
  }
  res.send({ status: 400 });
}

const getVoteUrl = (req, res) => {
  const basicUrl = process.env.BASIC_URL;
  const token = generate("3m");
  const voteUrl = `${basicUrl}/majority/player?token=${token}`;
  res.send({ status: 200, url: voteUrl });
}

const swipeRFID = async (req, res) => {
  try {
    const { uid } = req.body;
    const rfids = await findRFID({ uid });
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
      socket.io.emit("readChip/absent", { url: "/readChip/idle" });
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
      socket.io.emit("readChip/present", { url: "/readChip/data" });
    }

    res.send({ status: 200 })
  } catch (error) {
    console.error(error);
    res.send({ status: 500 })
  }
}


module.exports = {
  helloworld,
  pascal,
  getVoteUrl,
  swipeRFID,
  detectRFID
}
