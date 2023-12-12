import { Schema, model } from 'mongoose';

const lectureSchema = new Schema({
  sectionIndex: { type: Number, required: true },
  lectureIndex: { type: Number, required: true },
  content: { type: String, required: true }
});

const tempLecture = model('Lecture', lectureSchema);

export default tempLecture;
