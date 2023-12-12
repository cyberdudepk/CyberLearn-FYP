import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Footer from "../component/layout/footer";
import Header from "../component/layout/header";

const title = "Sign in";
const btnText = "Login Now";


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const body = JSON.stringify({ username, password }); // use username instead of email
            const res = await axios.post("http://localhost:4000/users/login", body, config);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", username); // store username in local storage
            setMessage("Login successful");
            setMessageType("success");
            setTimeout(()=> {
                navigate("/course");
                window.location.reload();
               }, 1000);
    
        } catch (err) {
            console.log(err)
            setMessage("Try Again!");
            setMessageType("error");
        }
    };
    

    return (
        <Fragment>
            <Header />
            <div className="padding-tb section-bg">
                <div className="container">
                    <div className="account-wrapper">
                        <h3 className="title">{title}</h3>
                        <form className="account-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text" // use input type 'text' instead of 'email'
                                    name="username"
                                    placeholder="Username *" // change placeholder
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} // set the username state variable
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password *"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {/* <div className="form-group">
                                <div className="d-flex justify-content-between flex-wrap pt-sm-2">
                                    <div className="checkgroup">
                                        <input type="checkbox" name="remember" id="remember" />
                                        <label htmlFor="remember">Remember Me</label>
                                    </div>
                                    <Link to="/forgetpass">Forget Password?</Link>
                                </div>
                            </div> */}
                            {message && (
                                <div className={`message message-${messageType}`}>{message}</div>
                            )}
                            <div className="form-group text-center">
                                <button className="d-block lab-btn"><span>{btnText}</span></button>
                            </div>
                        </form>


                        <div className="account-bottom">
                            <span className="d-block cate pt-10">Don’t Have any Account?  <Link to="/signup">Sign Up</Link></span>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}
 
export default LoginPage;