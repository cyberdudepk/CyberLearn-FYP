import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const questions = [
  {
    text: "What area of cybersecurity interests you the most?",
    options: ["Network Security", "Cryptography", "Ethical Hacking", "Malware Analysis", "Cybersecurity Fundamentals"],
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
    options: ["Firewalls and anti-virus software", "Intrusion detection systems", "Encryption algorithms", "Linux Tools", "Networking Tools"],
  },
  {
    text: "What type of cybersecurity challenges intrigue you?",
    options: ["Defending against cyber attacks", "Investigating cyber crimes", "Developing secure software", "Defend Phishing Attacks", "Vulnerability assessment"],
  }

];

const mapAnswersToTags = (answers) => {
    const tags = [];

    // Mapping for Question 1: Area of Cybersecurity Interest
    if (answers[0]) {
        switch (answers[0]) {
            case "Network Security":
                tags.push('Networking', 'Cisco', 'TCP' , 'UDP', 'Packets');
                break;
            case "Cryptography":
                tags.push('Cryptography' , 'Encryption' , 'Keys' , 'AES', 'RSA');
                break;
            case "Ethical Hacking":
                tags.push('Penetration Testing', 'Hacking' , 'Vulnerability');
                break;
            case "Malware Analysis":
                tags.push('Malware Analysis', 'Virus', 'Trojan');
                break;
            case "Cybersecurity Fundamentals":
                tags.push('Cybersecurity', 'security', 'Attack',);
                break;
            default:
                    break;
            // Add other options as needed
        }
    }
    
    if (answers[1]) {
        switch (answers[1]) {
            case "Career advancement":
                tags.push('Career', 'Growth' , 'skills');
                break;
            case "Academic knowledge":
                tags.push('Study' , 'Acedemic work' , 'Assignments' , 'Projects');
                break;
            case "Personal interest":
                tags.push('Interest' , 'Knowlegde' , 'Hobbies' );
                break;
            case "Starting a business":
                tags.push('Business' , 'Profit' , 'Startup');
                break;
            case "Improving organization's security":
                tags.push('Deffend' , 'Secure');
                break;
            default:
                break;
            // Add other options as needed
        }
    }


    // Mapping for Question 3: Knowledge Level
    if (answers[2] === "Beginner") {
        tags.push('Beginner');
    } else if (answers[2] === "Intermediate") {
        tags.push('Intermediate');
    }
    else if (answers[2] === "Advanced") {
        tags.push('Advanced');
    }
    else if (answers[2] === "Expert") {
        tags.push('Expert');
    }
    else if (answers[2] === "No prior experience") {
        tags.push('Beginner');
    }
    // Add other options as needed

    if (answers[3]) {
        switch (answers[3]) {
            case "Firewalls and anti-virus software":
                tags.push('Virus', 'anti-virus' , 'Malware' , 'Protocols');
                break;
            case "Intrusion detection systems":
                tags.push('Networking' , 'Detection' , 'Intrusion' , 'SOC');
                break;
            case "Encryption algorithms":
                tags.push('RSA', 'AES', 'TLS' , 'Public-keys' , 'Secret-keys');
                break;
            case "Linux Tools":
                tags.push('Linux' , 'ubuntu' , 'cd' , 'sudo');
                break;
            case "Networking Tools":
                tags.push('Wireshark' , 'INetSim', 'Packets');
                break;
            default:
                    break;
            // Add other options as needed
        }
    }

    // Mapping for Question 4: Tools/Technologies Interest
    // Add logic similar to above for different options

    if (answers[4]) {
        switch (answers[4]) {
            case "Defending against cyber attacks":
                tags.push('Attacks', 'Security' , 'Deffend');
                break;
            case "Investigating cyber crimes":
                tags.push('Analysis', 'Forensic' , 'Detection');
                break;
            case "Developing secure software":
                tags.push('Software' , 'Threat Modeling' , 'UML');
                break;
            case "Defend Phishing Attacks":
                tags.push('Phishing' , 'scam' , 'Fraud' );
                break;
            case "Vulnerability assessment":
                tags.push('Vulnerability' , 'Threat' , 'Ports' , 'Exploits');
                break;
            default:
                    break;
            // Add other options as needed
        }
    }

    // Mapping for Question 5: Type of Challenges
    // Add logic similar to above for different options

    console.log("Generated Tags:", tags); // Debugging line to display generated tags

    return tags;
};

const InitialQuiz = () => {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();


  const handleChange = (questionId, option) => {
    setAnswers({...answers,[questionId]: option});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tags = mapAnswersToTags(answers);

    console.log("Submitted Answers:", answers); // Debugging line to display submitted answers
    console.log("Mapped Tags:", tags); // Debugging line to display mapped tags

    const username = localStorage.getItem("username");
    try {
      await axios.post('http://localhost:4000/api/user-interests', {
        username, tags
      });
      console.log("Submission Successful"); // Debugging line to confirm submission
      navigate('/course'); // Navigate to the course page
    } catch (error) {
      console.error('Error submitting user interests:', error);
    }
  };

  return (
    <div className="quiz-container">
      <h1>Cybersecurity Interest Survey</h1>
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
