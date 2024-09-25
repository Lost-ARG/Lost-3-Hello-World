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

module.exports = {
  helloworld,
  pascal,
}
