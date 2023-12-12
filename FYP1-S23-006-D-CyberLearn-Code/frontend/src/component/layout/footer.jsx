
import { Link } from "react-router-dom";

const footerbottomList = [
    {
        text: 'Privacy Policy',
        link: '#',
    },
    {
        text: 'Terms & Conditions',
        link: '#',
    },

]

const FooterTwo = () => {
    return (
        <footer className="style-2">
            <div className="footer-bottom">
                <div className="container">
                    <div className="section-wrapper">
                        <p>&copy; 2023 <Link to="/">Cyber Learn</Link> All rights reserved. </p>
                        <div className="footer-bottom-list">
                            {footerbottomList.map((val, i) => (
                                <a href={val.link} key={i}>{val.text}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterTwo;