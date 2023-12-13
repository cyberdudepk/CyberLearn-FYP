import { Fragment, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import 'react-quill/dist/quill.snow.css';
import './create.css'
import Footer from "../../component/layout/footer";
import Header from "../../component/layout/header";
import ReactQuill from 'react-quill';
import axios from 'axios';


const Create = () => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const toolbarOptions = [['bold', 'italic'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  ];

  const languageOptions = ["English", "Spanish", "French", "German", "Mandarin", "Arabic", "Hindi", "Russian", "Portuguese", "Japanese",];

  const levelOptions = ["Beginner", "Intermediate", "Advanced",];

  const categoryOptions = [
    "Network Security",
    "Application Security",
    "Cloud Security",
    "Data Security",
    "Endpoint Security",
    "Wireless Security",
    "Internet of Things (IoT) Security",
    "Cryptography",
    "Penetration Testing",
    "Vulnerability Management",
    "Threat Intelligence",
    "Incident Response",
    "Forensics and Investigations",
    "Identity and Access Management",
    "Security Operations Center (SOC)",
    "Compliance and Regulations",
    "Risk Management",
    "Business Continuity and Disaster Recovery",
    "Physical Security",
    "Social Engineering and Phishing",
    "Security Awareness and Training",
    "Other"
  ];


  const handleNameChange = (event) => setName(event.target.value);
  const handleLanguageChange = (event) => setLanguage(event.target.value);
  const handleLevelChange = (event) => setLevel(event.target.value);
  const handleCategoryChange = (event) => setCategory(event.target.value);

  
  const [sections, setSections] = useState([]);

  const handleEditClick = (index) => {
    const newSections = [...sections];
    newSections[index].isEditing = true;
    setSections(newSections);
  };

  const handleDeleteClick = (index) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const addSection = () => {
    const newSection = {
      title: "",
      isEditing: true,
      lectures: [], // Add this line
    };
    setSections([...sections, newSection]);
  };



  const handleTitleChange = (index, event) => {
    const newSections = [...sections];
    newSections[index].title = event.target.value;
    setSections(newSections);
  };

  const handleAddClick = (index) => {
    const newSections = [...sections];
    if (newSections[index].title.trim()) {
      newSections[index].isEditing = false;
      setSections(newSections);
    } else {
      alert("Title is required to add a section.");
    }
  };





  const addLecture = (sectionIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].lectures.push({
      title: "",
      isEditing: true,
      file: null // Add this line to initialize file state
    });
    setSections(newSections);
  };

  const handleFileChange = (sectionIndex, lectureIndex, event) => {
    const newSections = [...sections];
    newSections[sectionIndex].lectures[lectureIndex].file = event.target.files[0];
    setSections(newSections);
  };

  const handleLectureTitleChange = (sectionIndex, lectureIndex, event) => {
    const newSections = [...sections];
    newSections[sectionIndex].lectures[lectureIndex].title = event.target.value;
    setSections(newSections);
  };

  const handleLectureAddClick = (sectionIndex, lectureIndex) => {
    const newSections = [...sections];
    if (newSections[sectionIndex].lectures[lectureIndex].title.trim()) {
      newSections[sectionIndex].lectures[lectureIndex].isEditing = false;
      setSections(newSections);
    } else {
      alert("Lecture title is required to add a lecture.");
    }
  };

  const handleLectureEditClick = (sectionIndex, lectureIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].lectures[lectureIndex].isEditing = true;
    setSections(newSections);
  };

  const handleLectureDeleteClick = (sectionIndex, lectureIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].lectures.splice(lectureIndex, 1);
    setSections(newSections);
  };








  const handleTagChange = (event) => {
    const tag = event.target.value.trim();
    if (event.key === "Enter" && tag && tags.length < 5) {
      setTags([...tags, tag]);
      event.target.value = "";
    }
  };

  const handleRemoveTag = (tagToRemove) =>
    setTags(tags.filter((tag) => tag !== tagToRemove));

  const handleImageChange = (event) => setImage(event.target.files[0]);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
  
    // Prepare courseData object
    const courseData = {
      name,
      content,
      language,
      level,
      category,
      tags,
      instructor: localStorage.getItem("username"),
      sections: sections.map((section) => ({
        ...section,
        lectures: section.lectures.map((lecture) => ({
          title: lecture.title,
        })),
      })),
    };
  
    formData.append("courseData", JSON.stringify(courseData));
    formData.append("image", image);
  
    try {
      console.log(formData);
      await axios.post("http://localhost:4000/courses", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        credentials: 'include',
      });
      // Redirect to course content page
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("Failed to create course. Try again!!!");
    }
  };
  





  const subTitle = "Featured Courses";
  const title = "Pick A Course To Get Started";


  



  const handleTextEditorClick = (sectionIndex, lectureIndex) => {
    if (localStorage.getItem("lectureTitle")) {
      Swal.fire({
        title: "Oops...",
        text: "You can only edit one lecture at a time.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }

    const newSections = [...sections];
    const lectureTitle = newSections[sectionIndex].lectures[lectureIndex].title;
    

    localStorage.setItem("lectureTitle", lectureTitle);
    localStorage.setItem("sectionIndex", sectionIndex);
    localStorage.setItem("lectureIndex", lectureIndex);
    window.open("/edit-lecture", "_blank");
  };

  return (
    <Fragment>
      <Header />
      <div className="padding-tb section-bg">
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">{subTitle}</span>
            <h2 className="title">{title}</h2>
          </div>
          <div className="top-wrapper1">
            <h4 className="title" style={{ color: "white" }}>Fill in course information</h4>
          </div>
          <div className="account-wrapper1">
            <form className="account-form" onSubmit={handleSubmit}>
              <h6 className="title">Course title</h6>
              <div className="form-group my-form">
                <input

                  type="text"
                  name="name"
                  placeholder="I will teach you interesting stuff...."
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              <h6 style={{ marginTop: "50px" }} className="title">
                Course description
              </h6>
              <div className="my-form">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  placeholder="This course is all about......"
                  modules={{
                    toolbar: toolbarOptions,
                  }}
                  style={{ maxHeight: '400px', overflowY: 'auto' }}
                />
              </div>

              <div style={{ marginTop: "50px" }} className="row">
                <div className="col-sm-4">
                  <h6 className="title">Language:</h6>
                  <select
                    style={{ border: "1px solid black" }}
                    className="form-control"
                    value={language}
                    onChange={handleLanguageChange}
                  ><option value="">Select Language</option>
                    {languageOptions.map((languageOption) => (
                      <option key={languageOption} value={languageOption}>
                        {languageOption}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-4">
                  <h6 className="title">Level:</h6>
                  <select
                    style={{ border: "1px solid black" }}
                    className="form-control"
                    value={level}
                    onChange={handleLevelChange}
                  >
                    <option value="">Select Level</option>
                    {levelOptions.map((levelOption) => (
                      <option key={levelOption} value={levelOption}>
                        {levelOption}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-4">
                  <h6 className="title">Category:</h6>
                  <select
                    style={{ border: "1px solid black" }}
                    className="form-control"
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((categoryOption) => (
                      <option key={categoryOption} value={categoryOption}>
                        {categoryOption}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: "50px" }} className="row">
                <div className="col-sm-8">
                  <h6 className="title">Tags:</h6>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add tags (up to 5)"
                    style={{ border: "1px solid black" }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleTagChange(event);
                      }
                    }}
                  />
                  <div className="tags-container ">
                    {tags.map((tag, index) => (
                      <span key={index} className="tag ">
                        {tag}
                        <button
                          type="button"
                          className="close"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <h6 style={{ marginTop: "50px" }} className="title">Course Image:</h6>
              <div className="form-group">
                <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
              </div>

              <h6 style={{ marginTop: "50px" }} className="title">Course Caricullum:</h6>






              <div className="section-wrapper1">
                {sections.map((section, index) => (
                  <div key={index} className="section-wrapper2">
                    {section.isEditing ? (
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter section title"
                          value={section.title}
                          onChange={(event) => handleTitleChange(index, event)}
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => handleAddClick(index)}
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <div className="section-title">
                        <h6 className="title">Section:- {section.title}</h6>
                        <div className="button-group">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleEditClick(index)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDeleteClick(index)}
                          >
                            Delete
                          </button>
                        </div>

                      </div>
                    )}
                    {section.lectures.map((lecture, lectureIndex) => (
                      <div key={lectureIndex} className="lecture-wrapper">

                        {lecture.isEditing ? (
                          <div className="form-group lecture-title-row">
                            <input
                              style={{ marginRight: "10px" }}
                              type="text"
                              className="form-control"
                              placeholder="Enter lecture title"
                              value={lecture.title}
                              onChange={(event) =>
                                handleLectureTitleChange(index, lectureIndex, event)
                              }
                            />
                            <button
                              style={{ maxWidth: "100px", height: "40px" }}
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => handleLectureAddClick(index, lectureIndex)}
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <div className="lecture-title-row">
                            <h6 className="title">Lecture: {lecture.title}</h6>
 
                            <div className="button-group">
                              
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => handleTextEditorClick(index, lectureIndex)}
                              >
                                Text Editor
                              </button>
                              
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => handleLectureEditClick(index, lectureIndex)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleLectureDeleteClick(index, lectureIndex)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                    {
                      !section.isEditing && (
                        <button
                          type="button"
                          className="lect-button"
                          onClick={() => addLecture(index)}
                        >
                          ➕ Add Lecture
                        </button>
                      )
                    }
                  </div>
                ))}
                <div className="form-group text-center">
                  <button type="button" className="btn btn-secondary" onClick={addSection}>
                    Add Section
                  </button>
                </div>
              </div>








              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-group text-center">
                <button type="submit" className="d-block lab-btn"><span>Create Course</span></button>
              </div>


            </form>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Create;