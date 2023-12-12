import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';

import 'swiper/css';

import ScrollToTop from "./component/layout/ScrollToTop";
import ErrorPage from "./page/404";
import MyCoursesList from "./page/my-courses";
import CoursePage from "./page/course";
import CourseSingle from "./page/course-single";
import Home from "./page/home";
import LoginPage from "./page/login";
import SignupPage from "./page/signup";
import CreateCourse from "./page/create/create";
import TextEditor from "./page/text-editor";
import EditCourse from "./page/create/edit"
import SearchPage from "./page/search";
import Dashboard from "./page/dashboard/dashboard";

function App() {
  const isAuthenticated = !!localStorage.getItem("token") && !!localStorage.getItem("username");

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={isAuthenticated ? <Home /> : <LoginPage />} />
        <Route path="signup" element={isAuthenticated ? <Home /> : <SignupPage />} />
        <Route path="/search/:id" element={<SearchPage />} />
        <Route path="course" element={<CoursePage/>}/>
        <Route path="/course/:id" element={<CourseSingle />} />
        <Route path="/edit/:id" element={isAuthenticated ? <EditCourse /> : <LoginPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <LoginPage />} />
        <Route path="/my-courses" element={isAuthenticated ? <MyCoursesList /> : <LoginPage />} />
        <Route path="/create" element={isAuthenticated ? <CreateCourse /> : <LoginPage />} />
        <Route path="/edit-lecture" target="_blank" element={isAuthenticated ? <TextEditor /> : <LoginPage />} />
        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/404" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
