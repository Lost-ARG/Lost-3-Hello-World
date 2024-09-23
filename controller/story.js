const { findStory } = require("../service/database/storyService");

const getStory = async (req, res) => {
  const { storyCode } = req.query;
  const story = (await findStory({ code: storyCode }))[0];
  const divergent = ["PVKFN", "B7GWL", "RM4XR", "23F3H"];
  story["divergent"] = false;
  if (divergent.includes(storyCode)) {
    story["divergent"] = true;
    for (let i = 0; i < story["next"].length; i += 1) {
      (story["nextName"] ??= []).push(storyFile[story["next"][i]]["name"]);
    }
  }
  res.send(story);
}

module.exports = {
  getStory,
}
