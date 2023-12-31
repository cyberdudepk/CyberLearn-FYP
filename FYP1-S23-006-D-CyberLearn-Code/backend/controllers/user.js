import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Course from '../models/Course.js'; 
import { exec } from "child_process";
import path from "path";

const signup = async (req, res) => {
  try {
    // Extract user details from request body
    const { name, username, email, password } = req.body;

    // Check if user with this email already exists
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Check if user with this username already exists
    const existingUserUsername = await User.findOne({ username });
    if (existingUserUsername) {
      return res
        .status(409)
        .json({ message: "User with this username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ email: user.email, userId: user._id }, "secret", {
      expiresIn: "1h",
    });

    // Send response with token
    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    // Extract user details from request body
    const { username, password } = req.body;
    console.log(req.body);

    // Check if user with this username exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Invalid username or password!");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Check if the provided password matches the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid username or password!");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, userId: user._id },
      "secret",
      { expiresIn: "1h" }
    );
    console.log("Success!");
    // Send response with token
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.log(error);
    console.log("Something went wrong!");
    res.status(500).json({ message: "Something went wrong" });
  }
};

// POST /user/unenroll - Unenroll user from a course
const unenroll = async (req, res) => {
  const { username, course_id } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: `User ${username} not found.` });
    }

    // Remove the course ID from the user's enrolled_courses array
    const index = user.enrolled_courses.indexOf(course_id);
    if (index > -1) {
      user.enrolled_courses.splice(index, 1);
    } else {
      return res.status(404).json({ message: `Course ${course_id} not found in user's enrolled courses.` });
    }

    // Save the updated user information to the database
    await user.save();

    res
      .status(200)
      .json({
        message: `Course ${course_id} removed from enrolled courses for user ${username}.`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};


const getEnrolledCourses = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username: username }, 'enrolled_courses');
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log("The enrolled courses are: ", user.enrolled_courses)

    const courses = await Course.find({
      _id: { $in: user.enrolled_courses }
    }).select('_id name image category instructor level sections.lectures');


    const formattedCourses = courses.map(course => {
      const lecturesCount = course.sections.reduce(
        (acc, section) => acc + section.lectures.length,
        0
      );
      return {
        _id: course._id,
        name: course.name,
        image: course.image,
        category: course.category,
        instructor: course.instructor,
        level: course.level,
        lecturesCount: lecturesCount
      };
    });

    console.log(formattedCourses)

    res.status(200).json(formattedCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /users/isEnrolled - Check if user is enrolled in a course
const isEnrolled = async (req, res) => {
  const { username, course_id } = req.query;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: `User ${username} not found.` });
    }

    const isEnrolled = user.enrolled_courses.includes(course_id);
    console.log("Sending back data: ", isEnrolled);
    res.status(200).json({ isEnrolled });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


// POST /user/enroll - Enroll user in a course
const enroll = async (req, res) => {
  const { username, course_id } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: `User ${username} not found.` });
    }

    // Add the course ID to the user's enrolled_courses array
    user.enrolled_courses.push(course_id);

    // Save the updated user information to the database
    await user.save();

    res
      .status(200)
      .json({
        message: `Course ${course_id} added to enrolled courses for user ${username}.`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const ConnectWindows = async (req, res) => {
  const filePath = path.join(process.cwd(), "cloudvm.rdp");

  let command;
  if (process.platform === "win32") {
    command = `start "" "${filePath}"`;
  } else if (process.platform === "darwin") {
    command = `open "${filePath}"`;
  } else {
    command = `xdg-open "${filePath}"`;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing file: ${error.message}`);
      return;
    }

    console.log("window File executed successfully");
  });
};

const ConnectKali = async (req, res) => {
  const filePath = path.join(process.cwd(), "kali.rdp");

  let command;
  if (process.platform === "win32") {
    command = `start "" "${filePath}"`;
  } else if (process.platform === "darwin") {
    command = `open "${filePath}"`;
  } else {
    command = `xdg-open "${filePath}"`;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing file: ${error.message}`);
      return;
    }

    console.log("kali File executed successfully");
  });
};

export default {
  signup,
  login,
  enroll,
  ConnectWindows,
  ConnectKali,
  isEnrolled,
  getEnrolledCourses,
  unenroll,
};
