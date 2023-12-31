import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../component/layout/footer";
import Header from "../component/layout/header";
import Swal from "sweetalert2";
import axios from "axios";

import "./my-courses.css"

const MyCoursePage = () => {
    const [courseList, setCourseList] = useState([]);

    useEffect(() => {
        async function fetchCourses() {
            const username = localStorage.getItem("username");
            if (!username) {
                console.log("No username")
                return;
            }
            const response = await fetch(`http://localhost:4000/courses/my-courses/${username}`);
            const data = await response.json();
            console.log(data)
            setCourseList(data);
        }
        fetchCourses();
    }, []);


    const handleDelete = async (id) => {
        try {
          await axios.delete(`http://localhost:4000/courses/${id}`);
          Swal.fire({
            title: "Success!",
            text: "Course Deleted successfully!",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          });
          setCourseList(courseList.filter(course => course._id !== id));
        } catch (error) {
          console.error(error);
        }
      }

    const subTitle = "Your Courses";
    const title = "Manage Your Course Offerings";

    return (
        <Fragment>
            <Header />

            <div className="course-section padding-tb section-bg">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">{subTitle}</span>
                        <h2 className="title">{title}</h2>
                    </div>
                    <div className="section-wrapper">

                        <div className="row g-4 justify-content-center row-cols-xl-3 row-cols-md-2 row-cols-1">
                            {courseList.map((val, i) => (
                                <div className="col" key={i}>
                                    <div className="my-blur">
                                        <div className="course-item"
                                            style={{ backgroundImage: `url(http://localhost:4000/${val.image})` }}>
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
                                                    <Link to=""><h4>{val.name}</h4></Link>
                                                    <div className="course-details">
                                                        <div className="couse-count"><i className="icofont-video-alt"></i> {val.lecturesCount}x lectures</div>
                                                        <div className="couse-topic"><i className="icofont-signal"></i> {val.level}</div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                        <div className="course-links">
                                            <Link to={`/edit/${val._id}`}>Edit</Link>
                                            <Link to="" onClick={() => handleDelete(val._id)}>Delete</Link>
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
}

export default MyCoursePage;

