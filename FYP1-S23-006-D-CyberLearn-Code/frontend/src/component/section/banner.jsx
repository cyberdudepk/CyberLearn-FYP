import { useState } from "react";
import { useNavigate} from "react-router-dom";

const subTitle = "Cyber Security Training";
const title = (
  <h2 className="title">
    <span className="d-lg-block">Learn to Secure</span>Things Right Now
  </h2>
);



const BannerTwo = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (e) => {
      setSearchTerm(e.target.value);
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      navigate(`/search/${searchTerm}`)
      
    };

  return (
    <section className="banner-section style-2">
      <div className="container">
        <div className="section-wrapper">
          <div className="row align-items-center flex-row-reverse">
            <div className="col-xxl-5 col-xl-6 col-lg-10 me-auto">
              <div className="banner-content">
                <h6 className="subtitle text-uppercase fw-medium">
                  {subTitle}
                </h6>
                {title}
                <form onSubmit={handleSubmit}>
                  <div className="banner-icon">
                    <i className="icofont-search"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Keywords of your course"
                    value={searchTerm}
                    onChange={handleChange}
                  />
                  <button type="submit" style={{ backgroundColor: "#26C976" }}>
                    Search Course
                  </button>
                </form>
              </div>
            </div>
            <div className="col-xxl-7 col-xl-6">
              <div className="thumb-part">
                <div className="banner-thumb text-center">
                  <img src="assets/images/banner/02.png" alt="img" />
                </div>
                <div className="abs-thumb d-none d-xxl-block">
                  <img src="assets/images/banner/03.png" alt="img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerTwo;
