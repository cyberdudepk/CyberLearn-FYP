import { Router } from "express";
import multer, { diskStorage } from "multer";
const router = Router();
import Course from "../models/Course.js";
import Lecture from "../models/tempLecture.js";

// Multer configuration for file uploads
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, "_"); // Replace colons with underscores
    cb(null, timestamp + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB file size limit
  },
});

// Middleware to handle files with keys "image" and "lectures"
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "lectures", maxCount: 100 },
]);

// Endpoint to create a new course
router.post("/", uploadFields, async (req, res) => {
  try {
    console.log(req.body.courseData);
    const {
      name,
      content,
      language,
      level,
      category,
      tags,
      instructor,
      sections,
    } = JSON.parse(req.body.courseData);

    const parsedSections = await Promise.all(
      sections.map(async (section, secIndex) => {
        const lectures = await Promise.all(
          section.lectures.map(async (lecture, lecIndex) => {
            const lectureContent = await Lecture.findOne({
              sectionIndex: secIndex,
              lectureIndex: lecIndex,
            });

            if (lectureContent) {
              try {
                await Lecture.deleteOne({
                  sectionIndex: secIndex,
                  lectureIndex: lecIndex,
                });
              } catch (error) {
                console.error(`Failed to delete lecture: ${error}`);
              }
            }

            return {
              title: lecture.title,
              content: lectureContent?.content,
            };
          })
        );

        return {
          ...section,
          lectures,
        };
      })
    );

    const course = new Course({
      name: name,
      content: content,
      language: language,
      level: level,
      category: category,
      tags: tags,
      instructor: instructor,
      image: req.files.image[0].path,
      sections: parsedSections,
    });

    await course.save();
    res.status(201).json({
      message: "Course created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create course",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find(
      {},
      {
        _id: 1,
        name: 1,
        image: 1,
        category: 1,
        instructor: 1,
        level: 1,
        "sections.lectures": 1,
      }
    );
    const formattedCourses = courses.map((course) => {
      const totalLectures = course.sections.reduce(
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
        totalLectures: totalLectures,
      };
    });
    res.status(200).json(formattedCourses);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve courses",
    });
  }
});

router.get("/load-lecture", async (req, res) => {
  const sectionIndex = req.query.sectionIndex;
  const lectureIndex = req.query.lectureIndex;

  try {
    const existingLecture = await Lecture.findOne({
      sectionIndex,
      lectureIndex,
    });

    if (existingLecture) {
      // If there's an existing lecture, return its content
      const content = existingLecture.content;
      res.status(200).send({ content });
    } else {
      // If there's no existing lecture, return an empty object
      res.status(200).send({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to get lecture content" });
  }
});

router.post("/edit/:id", uploadFields, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.body.courseData);
    const {
      name,
      content,
      language,
      level,
      category,
      tags,
      instructor,
      sections,
    } = JSON.parse(req.body.courseData);

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];
      for (
        let lectureIndex = 0;
        lectureIndex < section.lectures.length;
        lectureIndex++
      ) {
        const lecture = section.lectures[lectureIndex];
        
          const existingLecture = await Lecture.findOne({
            sectionIndex: sectionIndex,
            lectureIndex: lectureIndex,
          });
          lecture.content = existingLecture.content;
          await Lecture.deleteOne({
            sectionIndex: sectionIndex,
            lectureIndex: lectureIndex,
          });
        
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, {
      name,
      content,
      category,
      level,
      language,
      instructor,
      tags,
      sections,
    });


    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve course",
    });
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const {
      name,
      content: description,
      language,
      level,
      category,
      tags,
      image,
      sections,
    } = course;

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];
      for (
        let lectureIndex = 0;
        lectureIndex < section.lectures.length;
        lectureIndex++
      ) {
        const lecture = section.lectures[lectureIndex];
        if (lecture.content != "") {
          const existingLecture = await Lecture.findOne({
            sectionIndex: sectionIndex,
            lectureIndex: lectureIndex,
          });

          if (!existingLecture) {
            const newLecture = new Lecture({
              sectionIndex: sectionIndex,
              lectureIndex: lectureIndex,
              content: lecture.content,
            });
            await newLecture.save();
          }
        }
      }
    }

    // Find duplicates based on sectionIndex and lectureIndex
    const duplicatesPipeline = [
      {
        $group: {
          _id: {
            sectionIndex: "$sectionIndex",
            lectureIndex: "$lectureIndex",
          },
          ids: { $push: "$_id" },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ];
    const duplicates = await Lecture.aggregate(duplicatesPipeline);

    // Delete all but the first document in each group of duplicates
    for (const duplicate of duplicates) {
      const idsToDelete = duplicate.ids.slice(1);
      await Lecture.deleteMany({ _id: { $in: idsToDelete } });
    }

    const responseData = {
      name,
      description,
      language,
      level,
      category,
      tags,
      image,
      sections,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve course",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.deleteOne({ _id: courseId });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete course" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const {
      _id,
      name,
      content: description,
      image,
      sections,
      language,
      level,
    } = course;
    const lecturesCount = sections.reduce(
      (count, section) => count + section.lectures.length,
      0
    );
    const responseData = {
      _id,
      name,
      description,
      image,
      sections,
      language,
      level,
      lecturesCount,
    };
    console.log("Success!!!");
    res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve course",
    });
  }
});

router.get("/my-courses/:username", async (req, res) => {
  try {
    const courses = await Course.find(
      { instructor: req.params.username },
      {
        _id: 1,
        name: 1,
        image: 1,
        category: 1,
        instructor: 1,
        level: 1,
        "sections.lectures": 1,
      }
    );
    const formattedCourses = courses.map((course) => {
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
        lecturesCount: lecturesCount,
      };
    });
    res.status(200).json(formattedCourses);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve courses",
    });
  }
});

router.post("/save-lecture", async (req, res) => {
  const sectionIndex = req.body.sectionIndex;
  const lectureIndex = req.body.lectureIndex;
  const content = req.body.content;

  try {
    // Check if there's already a lecture with the same section and lecture index
    const existingLecture = await Lecture.findOne({
      sectionIndex: sectionIndex,
      lectureIndex: lectureIndex,
    });

    if (existingLecture) {
      // If there's an existing lecture, update its content
      existingLecture.content = content;
      await existingLecture.save();
    } else {
      // If there's no existing lecture, create a new one
      const newLecture = new Lecture({
        sectionIndex: sectionIndex,
        lectureIndex: lectureIndex,
        content: content,
      });
      await newLecture.save();
    }

    res.status(200).send("Lecture saved successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to save lecture. Please try again later.");
  }
});


router.get('/course-content/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      console("Course not found")
      return res.status(404).json({ message: "Course not found" });
    }
    console.log("Sending course content", course)
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving course" });
  }
});

export default router;
