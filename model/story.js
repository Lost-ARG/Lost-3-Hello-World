const jsonfile = require('jsonfile');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
  code: { type: String, required: true },
  progress_num: { type: Number, required: true },
  name: { type: String, required: true },
  story: { type: [String], required: true },
  next: { type: [String], required: true },
  ending: { type: String }
});

const Story = mongoose.model('Story', storySchema);

const file = './story.json';
const stories = jsonfile.readFileSync(file);

async function insertStories() {
  try {
      await Story.deleteMany({});

      for (const key in stories) {
        stories[key].code = key;
          const story = new Story(stories[key]);
          await story.save();
      }
  } catch (error) {
      console.error(error);
  }
}

insertStories();

module.exports = Story;
