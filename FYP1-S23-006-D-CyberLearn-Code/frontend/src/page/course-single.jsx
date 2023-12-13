import React, { Fragment, useState, useEffect } from "react";
import Footer from "../component/layout/footer";
import CommentComponent from "../component/sidebar/CommentComponent";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./course-single.css";
import Header from "../component/layout/header";
import Swal from "sweetalert2";

const CourseSingle = () => {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  // Function to check if user is already enrolled
  const checkEnrollment = async () => {
    const username = localStorage.getItem("username");
    try {
      const response = await axios.get(`http://localhost:4000/users/isEnrolled?username=${username}&course_id=${id}`);
      setIsEnrolled(response.data.isEnrolled);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/courses/${id}`);
        setCourse(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    
    };

    // Fetch comments
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/comments/${id}`);
        setComments(response.data);
      } catch (error) {
        console.error(error);
      }
    };



    fetchData();
    fetchComments();
    checkEnrollment(); // Call the checkEnrollment function on component mount
  }, [id]);

  const price = "Free";

  const csdcList = [
    {
      iconName: "icofont-ui-alarm",
      leftText: "Course level",
      rightText: course.level,
    },
    {
      iconName: "icofont-video-alt",
      leftText: "Lectures",
      rightText: course.lecturesCount,
    },
    {
      iconName: "icofont-abacus-alt",
      leftText: "Quizzes",
      rightText: "0",
    },

    {
      iconName: "icofont-globe",
      leftText: "Language",
      rightText: course.language,
    },
  ];

  const handleEnroll = async () => {
    const username = localStorage.getItem("username");

    try {
      const response = await axios.post("http://localhost:4000/users/enroll", {
        username: username,
        course_id: id,
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Congratulations!",
          text: "You have successfully enrolled in this course.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmitComment = async () => {
    const username = localStorage.getItem("username"); // Replace with dynamic username retrieval logic
    const commentData = {
      username,
      comment: commentText,
      courseId: id,
    };

    try {
      // Post the comment to your AI server for processing
      const aiResponse = await axios.post(
        "http://localhost:5000/process_comment",
        commentData
      );

      if (aiResponse.data && aiResponse.data.rating !== undefined) {
        const rating = aiResponse.data.rating;

        // Post the comment along with its rating to your backend for storage
        const backendResponse = await axios.post(
          'http://localhost:4000/api/comments',
          { ...commentData, rating }
        );

        // Update your comments state appropriately
        setComments([...comments, backendResponse.data]);
        setCommentText("");

        Swal.fire({
          title: "Success!",
          text: `Your comment has been submitted with a rating of ${rating}.`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Received an unexpected response from the server.",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Failed to submit your comment. Please try again.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Fragment>
      <Header />

      <div className="pageheader-section style-2">
        <div className="container">
          <div className="row justify-content-center justify-content-lg-between align-items-center flex-row-reverse">
            <div className="col-lg-7 col-12">
              <div className="pageheader-thumb">
                <img

                    src={`http://localhost:4000/${course.image}`} alt="Course" className="w-100"
                />
              </div>
            </div>
            <div className="col-lg-5 col-12">
              <div className="pageheader-content">
                <h2 className="phs-title">{course.name}</h2>

                <div className="course-enroll">
                  {isEnrolled ? (
                    <button className="lab-btn">
                      <Link to={`/classroom/${id}`}><span>Open In Academy</span></Link>
                    </button>
                  ) : (
                    <button onClick={() => handleEnroll()} className="lab-btn">
                      <span>Enroll Now</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="course-single-section padding-tb section-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="main-part">
                <div className="course-item">
                  <div className="course-inner">
                    <div className="course-inner-title">
                      <h4>Course Overview</h4>
                    </div>
                    <div
                      className="course-content"
                      dangerouslySetInnerHTML={{ __html: course.description }}
                    ></div>
                  </div>
                </div>

                <div className="course-video">
                  <div className="course-video-title">
                    <h4>Course Content</h4>
                  </div>
                  <div className="course-video-content">
                    <div className="accordion" id="accordionExample">
                      {course.sections && (
                        <div className="accordion-item">
                          {course.sections.map((section) => (
                            <div key={section._id}>
                              <div
                                className="accordion-header"
                                id={`accordion${section._id}`}
                              >
                                <button
                                  className="d-flex flex-wrap justify-content-between"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#videolist${section._id}`}
                                  aria-expanded="true"
                                  aria-controls={`videolist${section._id}`}
                                >
                                  <span>{section.title}</span>
                                </button>
                              </div>
                              <div
                                id={`videolist${section._id}`}
                                className="accordion-collapse collapse show"
                                aria-labelledby={`accordion${section._id}`}
                                data-bs-parent="#accordionExample"
                              >
                                <ul className="lab-ul video-item-list">
                                  {section.lectures.map((lecture) => (
                                    <li
                                      key={lecture._id}
                                      className="d-flex flex-wrap justify-content-between"
                                    >
                                      <div className="video-item-title">
                                        {lecture.title}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* <Respond /> */}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="sidebar-part">
                <div className="course-side-detail">
                  <div className="csd-title">
                    <div className="csdt-left">
                      <h4 className="mb-0">{price}</h4>
                    </div>
                  </div>
                  <div className="csd-content">
                    <div className="csdc-lists">
                      <ul className="lab-ul">
                        {csdcList.map((val, i) => (
                          <li key={i}>
                            <div className="csdc-left">
                              <i className={val.iconName}></i>
                              {val.leftText}
                            </div>
                            <div className="csdc-right">{val.rightText}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your existing JSX */}

      {/* Comment box */}
      <div className="comment-box">
        <h4>Add a Comment</h4>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Type your comment here..."
          rows={4}
          cols={50}
        ></textarea>
        <button onClick={handleSubmitComment}>Submit Comment</button>
      </div>
      {/* Comment List */}
      <CommentComponent comments={comments} />





      <Footer />
    </Fragment>
  );
};

export default CourseSingle;
