const helloworld = (req, res) => {
  const formData = req.body;
  console.log(formData);
  
  const ans = ["72", "101", "108", "108", "111", "87", "111", "114", "108", "100"];
  if(formData["answer"].join(",") === ans.join(",")) {
    res.redirect('/signUp');
    return;
  }
  res.send({message: "wrong answer"})
  
}


module.exports = {
  helloworld,
}
