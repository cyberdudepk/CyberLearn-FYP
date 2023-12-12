import { Router } from 'express';
const router = Router();
import { createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    addSectionToCourse,
    updateSection,
    deleteSection,
    addLessonToSection,
    updateLesson,
    deleteLesson,
    addStudentToCourse,
    removeStudentFromCourse } from '../controllers/instructor.js';


// Create a new course
router.post('/create', createCourse);
// Get all courses
router.get('/courses', getAllCourses);
// Get a single course by ID
router.get('/courses/:id', getCourseById);
// Update a course by ID
router.put('/courses/:id', updateCourse);
// Delete a course by ID
router.delete('/courses/:id', deleteCourse);
// Add a new section to a course
router.post('/courses/:id/sections', addSectionToCourse);
// Update a section by ID
router.put('/courses/:id/sections/:sectionId', updateSection);
// Delete a section by ID
router.delete('/courses/:id/sections/:sectionId', deleteSection);
// Add a new lesson to a section
router.post('/courses/:id/sections/:sectionId/lessons', addLessonToSection);
// Update a lesson by ID
router.put('/courses/:id/sections/:sectionId/lessons/:lessonId', updateLesson);
// Delete a lesson by ID
router.delete('/courses/:id/sections/:sectionId/lessons/:lessonId', deleteLesson);
// Add a student to a course
router.post('/courses/:id/students', addStudentToCourse);
// Remove a student from a course
router.delete('/courses/:id/students/:studentId', removeStudentFromCourse);

export default router;
