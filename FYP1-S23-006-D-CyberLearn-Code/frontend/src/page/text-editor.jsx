import React, { Fragment, useState, useEffect } from "react";
import Footer from "../component/layout/footer";
import Header from "../component/layout/header";
import ReactQuill from 'react-quill';
import axios from 'axios';
import Swal from "sweetalert2";

import './create/create.css'

const TextEditor = () => {

  const lecTitle = localStorage.getItem("lectureTitle");

  const handleCloseButton = () => {
    localStorage.removeItem("lectureTitle");
    localStorage.removeItem("sectionIndex");
    localStorage.removeItem("lectureIndex");
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleCloseButton);
    return () => {
      window.removeEventListener("beforeunload", handleCloseButton);
    };
  }, []);

  const [text, setText] = useState("");

  const toolbarOptions = [    ['bold', 'italic', 'underline', 'strike'],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean']
  ];

  const handleTextChange = (value) => {
    setText(value);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData.getData("text/plain");
    const newLineRegex = /(\r\n|\n|\r)/gm;
    const cleanedText = clipboardData.replace(newLineRegex, "<br>");
    const newText = `${text}${cleanedText}`;
    setText(newText);
  };


  const handleSaveButton = async () => {
    const sectionIndex = localStorage.getItem("sectionIndex");
    const lectureIndex = localStorage.getItem("lectureIndex");
    
    try {
      await axios.post('http://localhost:4000/courses/save-lecture', {
        sectionIndex: sectionIndex,
        lectureIndex: lectureIndex,
        content: text
      });
      
      // Show success message to user
      Swal.fire({
        title: "Success!",
        text: "Lecture saved successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } catch (error) {
      // Handle error
      console.error(error);
      // Show error message to user
      Swal.fire({
        title: "Error!",
        text: "Failed to save lecture. Please try again later.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  };


  useEffect(() => {
    const getLectureContent = async () => {
      try {
        const sectionIndex = localStorage.getItem("sectionIndex");
        const lectureIndex = localStorage.getItem("lectureIndex");
        const response = await fetch(`http://localhost:4000/courses/load-lecture?sectionIndex=${sectionIndex}&lectureIndex=${lectureIndex}`);
        const { content } = await response.json();
        setText(content);
      } catch (error) {
        console.error(error);
      }
    };
  
    getLectureContent();
  }, []);
  
  
  
  const subTitle = "Lecture Content Editor";
  const title = "Fine-Tune Your Lecture Content";
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
            <h4 className="title" style={{ color: "white" }}>{lecTitle}</h4>
          </div>
          <div className="account-wrapper1">
            <div className="lecture-title-row">
              <h6 style={{ marginTop: "50px" }} className="title">
                Course description
              </h6>
              <div className="button-group">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    handleSaveButton();
 
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    handleCloseButton();
                    window.close();

                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <ReactQuill
              value={text}
              onChange={handleTextChange}
              onPaste={handlePaste}
              modules={{
                toolbar: toolbarOptions,
              }}
              style={{ minHeight: '400px', overflowY: 'auto' }}
            />

          </div>
        </div>
      </div>
      <Footer />
    </Fragment>

  );
};

export default TextEditor;
