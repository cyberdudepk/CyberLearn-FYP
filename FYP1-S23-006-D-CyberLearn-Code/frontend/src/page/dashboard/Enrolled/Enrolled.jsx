import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';

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


    const handleUnroll = async (courseId) => {
        const apiEndpoint = 'http://localhost:4000/users/unenroll'; // Replace with your actual API endpoint
    
        // Retrieve username from localStorage
        const username = localStorage.getItem('username');
        if (!username) {
            console.error('No username found in localStorage');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No username found. Please log in again.',
            });
            return;
        }
    
        try {
            const response = await axios.post(apiEndpoint, {
                username: username,
                course_id: courseId
            });
    
            if (response.status === 200) {
                console.log('Unenrollment successful');
                // Show success popup
                Swal.fire({
                    icon: 'success',
                    title: 'Unenrolled!',
                    text: 'You have been successfully unrolled!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    // Refresh the page
                    window.location.reload();
                });
            } else {
                console.error('Unenrollment failed:', response.data.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Unenrollment failed',
                    text: response.data.message,
                });
            }
        } catch (error) {
            console.error('Error during unenrollment:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'There was an error unenrolling from the course.',
            });
        }
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
                                        <Link to={`/classroom/${val._id}`}>Open In Classroom</Link>
                                            <Link to="" onClick={() => handleUnroll(val._id)}>Unroll</Link>
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

