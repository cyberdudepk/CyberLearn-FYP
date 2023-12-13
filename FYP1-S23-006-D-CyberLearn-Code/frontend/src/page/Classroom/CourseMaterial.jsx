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
        console.log(course.name);
        if (course && course.sections) {
          setSections(course.sections);
          setSelectedSection(course.sections[0]); // Set the first section as active by default
          setCourseTitle(course.name); // Assuming course title is part of the course object
        }
      } catch (error) {
        console.error("Error fetching course content:", error);
      }
    };

    fetchCourseContent();
  }, [courseId]);

  const [expandedLectures, setExpandedLectures] = useState({});

  const toggleLecture = (index) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Fragment>
      <div style={{ backgroundColor: "#FFF9F1" }}>
        <div style={{ display: "flex" }}>
          <div className="sidebar">
            <div className="sidebar-logo">
              <Link to="/">
                <img
                  src="http://localhost:3000/assets/images/logo/green.png"
                  alt="Logo"
                  className="logo-image"
                />
              </Link>
            </div>

            <div className="course-title">
              <h2>{courseTitle}</h2>
              <div className="animated-divider"></div>
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

            <div className="back-to-dashboard">
              <Link to="/dashboard">Back to Dashboard</Link>
            </div>
          </div>

          <div style={{ marginLeft: "30%", width: "70%" }}>
            {selectedSection && (
              <div className="main-div">
                <h2>{selectedSection.title}</h2>
                <div className="fancy-divider"></div>
                {selectedSection.lectures.map((lecture, index) => (
                  <div key={index}>
                    <div className="main-heading">
                      <h3>{lecture.title}</h3>
                      <p onClick={() => toggleLecture(index)}>
                        {expandedLectures[index] ? "➖" : "➕"}
                      </p>
                    </div>
                    {expandedLectures[index] && (
                      <div
                        className="answers"
                        dangerouslySetInnerHTML={{ __html: lecture.content }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </Fragment>
  );
};

export default DashboardWithSidebar;
