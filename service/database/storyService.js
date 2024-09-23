const Story = require('../../model/story');

const findStory = async (condition = {}) => {
  try {
    const story = await Story.find(condition);
    return story;
  } catch (error) {
    throw new Error(`Find Story Failed, Error: ${error.toString()}`)
  }
}

module.exports = {
  findStory,
}
