import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    text: "What area of cybersecurity interests you the most?",
    options: ["Network Security", "Cryptography", "Ethical Hacking", "Cyber Law and Ethics", "Data Protection and Privacy"],
  },
  {
    text: "What is your primary goal in learning cybersecurity?",
    options: ["Career advancement", "Academic knowledge", "Personal interest", "Starting a business", "Improving organization's security"],
  },
  {
    text: "How would you describe your current knowledge of cybersecurity?",
    options: ["Beginner", "Intermediate", "Advanced", "Expert", "No prior experience"],
  },
  {
    text: "Which of these cybersecurity tools or technologies are you most interested in?",
    options: ["Firewalls and anti-virus software", "Intrusion detection systems", "Encryption algorithms", "Cloud security", "IoT security"],
  },
  {
    text: "What type of cybersecurity challenges intrigue you?",
    options: ["Defending against cyber attacks", "Investigating cyber crimes", "Developing secure software", "Policy making and compliance", "Vulnerability assessment"],
  }


];

const InitialQuiz = () => {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleChange = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option
    });
  };

  const handleSubmit = () => {
    console.log(answers);
    navigate('/course'); // Navigate to the recommendations page
  };

  return (
    <div className="quiz-container">
      <h1>Cybersecurity Interest Quiz</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} className="question">
            <p>{question.text}</p>
            {question.options.map((option, i) => (
              <label key={i}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={() => handleChange(index, option)}
                />
                {option}
              </label>
            ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InitialQuiz;
