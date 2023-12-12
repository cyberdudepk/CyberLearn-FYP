import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../page/course.css";

const Course = () => {
  const subTitle = "Featured Courses";
  const title = "Discover the Best with Our Featured Courses";

  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      const response = await fetch("http://localhost:4000/courses");
      const data = await response.json();
      console.log(data);
      setCourseList(data);
    }
    fetchCourses();
  }, []);

  return (
    <div className="course-section padding-tb section-bg">
      <div className="container">
        <div className="section-header text-center">
          <span className="subtitle">{subTitle}</span>
          <h2 className="title">{title}</h2>
        </div>
        <div className="section-wrapper">
          <div className="row g-4 justify-content-center row-cols-xl-3 row-cols-md-2 row-cols-1">
            {courseList.map(
              (val, i) =>
                i < 6 && (
                  <div className="col" key={i}>
                    <div className="course-item">
                      <div className="course-inner">
                        <div className="course-thumb">
                          <img src={`http://localhost:4000/${val.image}`} />
                        </div>
                        <div className="course-content">
                          <div className="course-category">
                            <div className="course-cate">
                              <a href="#">{val.category}</a>
                            </div>
                          </div>
                          <Link to={`/course/${val._id}`}>
                            <h4>{val.name}</h4>
                          </Link>
                          <div className="course-details">
                            <div className="couse-count">
                              <i className="icofont-video-alt"></i>{" "}
                              {val.totalLectures}x lectures
                            </div>
                            <div className="couse-topic">
                              <i className="icofont-signal"></i> {val.level}
                            </div>
                          </div>
                          <div className="course-footer">
                            <div className="course-author">
                              <img
                                src="../assets/images/author/01.jpg"
                                style={{ width: "35px", height: "35px" }}
                              />
                              <Link to="/team-single" className="ca-name">
                                {val.instructor}
                              </Link>
                            </div>
                            <div className="course-enroll">
                              <Link
                                to={`/course/${val._id}`}
                                className="lab-btn"
                              >
                                <span>View More</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
