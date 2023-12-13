import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";


import "./Enrolled.css"

const Enrolled = ({ onSelectCourse }) => {
    const [courseList, setCourseList] = useState([]);

    useEffect(() => {
        async function fetchEnrolledCourses() {
            const username = localStorage.getItem("username");
            if (!username) {
                console.log("No username found");
                return;
            }
            
            try {
                const response = await fetch(`http://localhost:4000/users/getEnrolledCourses?username=${username}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCourseList(data);
            } catch (error) {
                console.error("Error fetching enrolled courses: ", error);
            }
        }
        
        fetchEnrolledCourses();
    }, []);


    const handleDelete = async (id) => {
        // Delete logic here
    };



    const subTitle = "Enrolled Courses";
    const title = "Start Where You Left Off!";

    return (
        <Fragment>
          

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
                                        <Link to="#">Edit</Link>
                                            <Link to="" onClick={() => handleDelete(val._id)}>Delete</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

        </Fragment>
    );
}

export default Enrolled;

