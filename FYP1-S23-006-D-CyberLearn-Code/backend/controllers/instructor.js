import Course from '../models/Course.js';

// Create a new course
export const createCourse = async (req, res) => {
  try {
    // Get the course data from the request body
    const { title, description, instructor, image, sections, students } = req.body;
    // Create a new course with the provided data
    const course = new Course({ title, description, instructor, image, sections, students });
    // Save the course to the database
    const newCourse = await course.save();
    // Return the newly created course
    res.status(201).json(newCourse);
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    res.status(500).json({ error: 'Unable to create course' });
  }
};


// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    // Find all courses in the database
    const courses = await Course.find();
    // Return the courses
    res.status(200).json(courses);
  } catch (error) {
    // Handle any errors that occur while retrieving the courses
    res.status(500).json({ error: 'Unable to retrieve courses' });
  }
};


export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const result = await deleteCourse(courseId);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete course' });
  }
};

// Get a single course by ID
export const getCourseById = async (req, res) => {
  try {
    // Find the course with the provided ID
    const course = await Course.findById(req.params.id);
    if (!course) {
      // If the course is not found, return a 404 error
      res.status(404).json({ error: 'Course not found' });
    } else {
      // Otherwise, return the course
      res.status(200).json(course);
    }
  } catch (error) {
    // Handle any errors that occur while retrieving the course
    res.status(500).json({ error: 'Unable to retrieve course' });
  }
};



export const updateCourse = async (req, res) => {
  try {
    // Find the course with the provided ID
    const course = await Course.findById(req.params.id);
    if (!course) {
      // If the course is not found, return a 404 error
      res.status(404).json({ error: 'Course not found' });
    } else {
      // Update the course with the new data
      const { title, description, instructor, image, sections, students } = req.body;
      course.title = title;
      course.description = description;
      course.instructor = instructor;
      course.image = image;
      course.sections = sections;
      course.students = students;

      // Save the updated course to the database
      const updatedCourse = await course.save();

      // Return the updated course
      res.status(200).json(updatedCourse);
    }
  } catch (error) {
    // Handle any errors that occur while updating the course
    res.status(500).json({ error: 'Unable to update course' });
  }
};


export const addSectionToCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    course.sections.push({ title });
    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



export const updateSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const section = course.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    const { title } = req.body;
    if (title) {
      section.title = title;
    }
    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



export const deleteSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const section = course.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    section.remove();
    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const addLessonToSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const section = course.sections.id(req.params.sectionId);
    const lesson = req.body;
    section.lessons.push(lesson);
    await course.save();
    res.json(section);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


export const updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const section = course.sections.id(req.params.sectionId);
    const lesson = section.lessons.id(req.params.lessonId);
    Object.assign(lesson, req.body);
    await course.save();
    res.json(lesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


export const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const section = course.sections.id(req.params.sectionId);
    const lesson = section.lessons.id(req.params.lessonId);
    lesson.remove();
    await course.save();
    res.json(section);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// Add a student to a course
export const addStudentToCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const student = await User.findById(req.body.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    course.students.push(student);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Remove a student from a course
export const removeStudentFromCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const studentId = req.params.studentId;
    if (!course.students.includes(studentId)) {
      return res.status(404).json({ message: 'Student not found in course' });
    }
    course.students = course.students.filter((student) => student.toString() !== studentId);
    await course.save();
    res.status(200).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

