import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CourseMaterial.css";

const CourseMaterial = () => {
    const { id } = useParams();
    const [course, setCourse] = useState({});
    const [activeLectureId, setActiveLectureId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:4000/courses/course-content/${id}`);
            setCourse(response.data);
          } catch (error) {
            console.error("Error fetching course content:", error);
          }
        };
        fetchData();
      }, [id]);
      

    const toggleLecture = (lectureId) => {
        setActiveLectureId(activeLectureId === lectureId ? null : lectureId);
    };

    return (
        <Fragment>
            <div className="course-section padding-tb section-bg">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="main-part">
                                {course.sections && course.sections.map((section) => (
                                    <div key={section._id} className="course-video">
                                        <div className="course-video-title">
                                            <h4>{section.title}</h4>
                                        </div>
                                        <div className="course-video-content">
                                            {section.lectures.map((lecture) => (
                                                <div key={lecture._id} className="accordion">
                                                    <div className="accordion-header" onClick={() => toggleLecture(lecture._id)}>
                                                        <h5>{lecture.title}</h5>
                                                    </div>
                                                    {activeLectureId === lecture._id && (
                                                        <div className="accordion-content">
                                                            <p>{lecture.content}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default CourseMaterial;
