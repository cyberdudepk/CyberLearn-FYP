import { Fragment } from "react";
import Footer from "../component/layout/footer";
import Header from "../component/layout/header";
import Banner from "../component/section/banner";
import Category from "../component/section/category";
import Courses from "../component/section/course";



const Home = () => {
    return (
        <Fragment>
            <Header />
            <Banner />
            <Category />
            <Courses />
            <Footer />
        </Fragment>
    );
}
 
export default Home;