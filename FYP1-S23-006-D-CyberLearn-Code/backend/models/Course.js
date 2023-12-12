import { Schema, model } from 'mongoose';

const lectureSchema = new Schema({
  title: String,
  content: String
});

const sectionSchema = new Schema({
  title: String,
  lectures: [lectureSchema]
});

const courseSchema = new Schema({
  name: String,
  content: String,
  language: String,
  level: String,
  category: String,
  tags: [String],
  instructor: String,
  image: String,
  sections: [sectionSchema]
});

const Course = model('Course', courseSchema);

export default Course;
