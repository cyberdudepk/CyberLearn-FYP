import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../component/layout/footer";
import Header from "../component/layout/header";
import { useNavigate } from "react-router-dom";

const title = "Register Now";
const btnText = "Get Started Now";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const { name, username, email, password, confirmPassword } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setMessageType("error");
        } else {
            const newUser = {
                name,
                username,
                email,
                password,
            };
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                };
                const body = JSON.stringify(newUser);
                console.log("=======================");
                console.log(body);
                const res = await axios.post("http://localhost:4000/users/signup", body, config);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("username", username);
                setMessage("Signup successful");
                setMessageType("success");
                setTimeout(() => {
                    navigate("/Survey");
                    window.location.reload();
                }, 1000);


            } catch (err) {
                console.error(err.response.data);
                setMessage("Signup failed");
                setMessageType("error");
            }
        }
    };

    return (
        <Fragment>
            <Header />
            <div className="login-section padding-tb section-bg">
                <div className="container">
                    <div className="account-wrapper">
                        <h3 className="title">{title}</h3>



                        <form className="account-form" onSubmit={(e) => onSubmit(e)}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e) => onChange(e)}
                                    placeholder="Full Name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={(e) => onChange(e)}
                                    placeholder="Username"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => onChange(e)}
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => onChange(e)}
                                    placeholder="Password"
                                    minLength="6"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => onChange(e)}
                                    placeholder="Confirm Password"
                                    minLength="6"
                                    required
                                />
                            </div>
                            {message && (
                                <div className={`message message-${messageType}`}>{message}</div>
                            )}
                            <div className="form-group">
                                <button className="lab-btn">
                                    <span>{btnText}</span>
                                </button>
                            </div>

                        </form>


                        <div className="account-bottom">
                            <span className="d-block cate pt-10">Are you a member? <Link to="/login">Login</Link></span>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default SignupPage;