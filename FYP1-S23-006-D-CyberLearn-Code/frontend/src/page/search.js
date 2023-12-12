import { Fragment, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../component/layout/footer";
import Header from "../component/layout/header";
import "./course.css";

const SearchPage = () => {
  const { id: searchTermFromUrl } = useParams();
  const [searchTerm, setSearchTerm] = useState(searchTermFromUrl || "");
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

  const filteredCourses =
    searchTerm && searchTerm.trim() !== ""
      ? courseList.filter((course) => {
          const lowerCaseSearchTerm = String(searchTerm).toLowerCase();

          return (
            course.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            course.category.toLowerCase().includes(lowerCaseSearchTerm)
          );
        })
      : courseList;


  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };



  return (
    <Fragment>
      <Header />

      <div className="course-section padding-tb section-bg">
        <div className="container">

          

            <input
              type="text"
              className="search-input"
              placeholder="Keywords of your course"
              value={searchTerm}
              onChange={handleChange}
            />

          

   

          <div className="section-wrapper">
            <div className="row g-4 justify-content-center row-cols-xl-3 row-cols-md-2 row-cols-1">
              {filteredCourses.map((val, i) => (
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
                            <Link to={`/course/${val._id}`} className="lab-btn">
                              <span>View More</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default SearchPage;
