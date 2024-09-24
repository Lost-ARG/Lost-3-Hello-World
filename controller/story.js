const { findStory } = require("../service/database/storyService");

const getStory = async (req, res) => {
  const { storyCode } = req.query;
  let story = (await findStory({ code: storyCode }))[0];
  if (!story) {
    res.send({ status: 404 });
    return;
  }

  story = story.toObject();

  const divergent = ["PVKFN", "B7GWL", "RM4XR", "23F3H"];
  story["divergent"] = false;
  if (divergent.includes(storyCode)) {
    story["divergent"] = true;
    for (let i = 0; i < story["next"].length; i += 1) {
      const nextStory = (await findStory({ code: story["next"][i] }))[0];
      (story["nextName"] ??= []).push(nextStory["name"]);
    }
  }

  res.send(story);
}

module.exports = {
  getStory,
}
