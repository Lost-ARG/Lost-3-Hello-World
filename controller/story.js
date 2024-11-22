const { findStory } = require("../service/database/storyService");

const getStory = async (req, res) => {
  const { storyCode } = req.query;
  let story = (await findStory({ code: storyCode }))[0];
  if (!story) {
    res.send({ status: 404 });
    return;
  }

  story = story.toObject();

  const divergent = [
    process.env.LEVEL_5_STORY_CODE,
    process.env.LEVEL_5_1_STORY_CODE,
    process.env.LEVEL_13_STORY_CODE,
    process.env.LEVEL_13_1_STORY_CODE,
  ];
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
