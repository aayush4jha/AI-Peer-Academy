import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import NotFoundPage from "./components/common/NotFoundPage";
import Section1 from "./components/Homepage/Section1";
import Section2 from "./components/Homepage/Section2";
import Section3 from "./components/Homepage/Section3";
import Section4 from "./components/Homepage/Section4";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";

import SubjectList from "./pages/admin/Subject";
import ModuleList from "./pages/admin/Module";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SubModuleList from "./pages/admin/SubModule";
import QuizInterface from "./pages/QuizInterface";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import PaymentForm from "./pages/payments/PaymentForm";
import PaymentFailurePage from "./pages/payments/PaymentFailurePage";
import PaymentSuccessPage from "./pages/payments/PaymentSuccessPage";
import Homepage from "./pages/Homepage";
import ContactUs from "./pages/ContactUs";
import OpenRoute from "./components/auth/Openroute";
import PrivateRoute from "./components/auth/Privateroute";
import AdminRoute from "./components/auth/AdminRoute";

function App() {
  return (
    <>
      <Header />
      {/* <NotFoundPage /> */}
      {/* <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />*/}

      {/* <Dashboard /> */}
      {/* <QuizInterface /> */}
      {/* <AnalyticsDashboard /> */}
      {/* <PaymentForm /> */}
      {/* <PaymentSuccessPage />
      <PaymentFailurePage /> */}
      {/* <Homepage /> */}
      {/* <ContactUs /> */}
      {/* home,contactus , not found, payments, analytics, courseDetail, dashboard, homepage, quesionInterface, quizcompletionScreen */}
      {/* admin wala-> module, subject, submodule  */}
      <Routes>
        <Route
          path="/"
          element={
            <OpenRoute>
              <Homepage />
            </OpenRoute>
          }
        />
        <Route
          path="/courses/:courseName/:courseId"
          element={
            <PrivateRoute>
              <CourseDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <SubjectList />
            </AdminRoute>
          }
        />
        <Route path="/admin/courses/:courseName" element={<ModuleList />} />
        <Route
          path="/course/:subjectId/:subModule_id"
          element={
            <PrivateRoute>
              <QuizInterface />
            </PrivateRoute>
          }
        />
        <Route
          path="courses/view-stats/:subModuleId"
          element={
            <PrivateRoute>
              <AnalyticsDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/courses/modules/:moduleName"
          element={<SubModuleList />}
        />
        <Route path="/" element={<Homepage />} /> 
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-failure" element={<PaymentFailurePage />} />
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
      <Footer />
      {/* <CourseDetail /> */}
    </>
  );
}

export default App;

// import React, { useState } from "react";
// import GoogleSignInButton from "./components/GoogleSignInButton";

// function App() {
//   const [user, setUser] = useState(null);

//   return (
//     <div className="App">
//       {!user ? (
//         <GoogleSignInButton />
//       ) : (
//         <div>
//           <h3>Welcome, {user.name}</h3>
//           <p>
//             Subscription Status: {user.isSubscribed ? "Member" : "Not a Member"}
//           </p>
//           <img src={user.picture} alt={user.name} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
