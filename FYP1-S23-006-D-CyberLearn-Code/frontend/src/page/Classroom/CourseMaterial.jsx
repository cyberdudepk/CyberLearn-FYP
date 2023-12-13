import React, { useState, useEffect, Fragment } from "react";
import { Link, useParams } from "react-router-dom";

import Footer from "../../component/layout/footer";
import "./CourseMaterial.css";
// Import other necessary components or assets

const DashboardWithSidebar = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");

  const { id: courseId } = useParams();

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/courses/course-content/${courseId}`
        );
        const course = await response.json();
        if (course && course.sections) {
          setSections(course.sections);
          setSelectedSection(course.sections[0]); // Set the first section as active by default
          setCourseTitle(course.title); // Assuming course title is part of the course object
        }
      } catch (error) {
        console.error("Error fetching course content:", error);
      }
    };

    fetchCourseContent();
  }, [courseId]);

  return (
    <Fragment>
      <div style={{ display: "flex" }}>
        <div className="sidebar">
          <div className="sidebar-logo">
            {/* Assuming you have a logo image, adjust the path as necessary */}
            <img
              src="http://localhost:3000/assets/images/logo/green.png"
              alt="Logo"
              className="logo-image"
            />
          </div>

          <div className="course-title">
            <h2>{courseTitle}</h2>
          </div>

          {/* Sidebar menu items */}
          {sections.map((section, index) => (
            <div
              key={index}
              className={`menu-item ${
                selectedSection === section ? "active" : ""
              }`}
              onClick={() => setSelectedSection(section)}
            >
              {section.title}
            </div>
          ))}
        </div>

        <div style={{ marginLeft: "30%", width: "70%" }}>
          {/* Content of the selected section */}
          {selectedSection && (
            <div>
              <h2>{selectedSection.title}</h2>
              {selectedSection.lectures.map((lecture, index) => (
                <div key={index}>
                  <h3>{lecture.title}</h3>
                  {/* Render HTML content safely */}
                  <div dangerouslySetInnerHTML={{ __html: lecture.content }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </Fragment>
  );
};

export default DashboardWithSidebar;
