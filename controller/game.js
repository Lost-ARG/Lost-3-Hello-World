const { findRFIDCard } = require("../service/database/RFIDCardService");
const { generate } = require("../service/jwtService");

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
    const card_id = req.body["uid"];
    const card = await findRFIDCard({ card_id });
    if (card.length === 0) {
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


module.exports = {
  helloworld,
  pascal,
  getVoteUrl,
  swipeRFID
}
