import "tailwindcss/tailwind.css";
import { Routes, Route } from "react-router-dom";
import "../styles/App.css";
import Home from "../components/homepage/Home";
import Login from "../components/homepage/Login";

// import ChangePwd from "../components/homepage/ChangePwd";
import CreateAbsence from "./trainee/absence/CreateAbsence.jsx";
import CreateTimeAdjustment from "./trainee/timeAdjustment/CreateTimeAdjustment.jsx";
import Profile from "./profile/Profile.jsx";
import UploadUserCsv from "./admin/UploadUserCsv.jsx";
import ViewTimeAdjustments from "./trainee/timeAdjustment/ViewTimeAdjustments.jsx";
import TimeAdjustmentDetail from "./trainee/timeAdjustment/TimeAdjustmentDetail.jsx";
import ViewAbsences from "./trainee/absence/ViewAbsences.jsx";
import AbsenceDetail from "./trainee/absence/AbsenceDetail.jsx";
import AdminAbsenceDetail from "./admin/AbsenceDetail.jsx";
import AdminTimeAdjustmentDetail from "./admin/TimeAdjustmentDetail.jsx";

// import UploadEmployeecsv from "./admin/UploadEmployeeCsv.jsx";
import ClockinClockout from "./trainee/clockInOut/CreateCiCo.jsx";
import ViewCicos from "./trainee/clockInOut/ViewCico.jsx";
import AdminTimeAdjustments from "./admin/TimeAdjustments.jsx";
import AdminProfile from "./profile/AdminProfile.jsx";
import AdminAbsences from "./admin/Absence.jsx";
import AdminClockInClockOut from "./admin/ClockInClockOut.jsx";
import MentorGetAllTimeAdjustments from "./mentor/MentorAllTimeAdjustments.jsx";
import MentorTimeAdjustments from "./mentor/MentorTimeAdjustments.jsx";
import MentorGetAllAbsences from "./mentor/MentorAllAbsences.jsx";
import MentorAbsences from "./mentor/MentorAbsences.jsx";
import AdminHome from "./admin/AdminHome.jsx";
import ChangePassword from "./homepage/ChangePassword.jsx";
import MentorRegisteration from "./admin/UploadMentor.jsx";
import MentorProfile from "./profile/MentorProfile.jsx";
import TimeAdjustmentForCico from "./trainee/clockInOut/createTimeAdjustmentForCico.jsx";
import ForgotPassword from "./homepage/ForgotPassword.jsx";

import Mentors from "./admin/Mentors.jsx";
import Trainees from "./admin/Trainees.jsx";
import TraineeData from "./admin/traineeData.jsx";
import MentorData from "./admin/mentorData.jsx";

import TimeAdjustmentReasons from "./admin/TimeAdjustmentReasons.jsx";
import TimeAdjustmentReasonsNew from "./admin/TimeAdjustmentReasonsNew.jsx";
import EditTimeAdjustmentReason from "./admin/TimeAdjustmentReasonData.jsx";

import LeaveRequestTypes from "./admin/LeaveRequestTypes.jsx";
import LeaveRequestTypesNew from "./admin/LeaveRequestTypesNew.jsx";
import LeaveRequestTypeEdit from "./admin/LeaveRequestTypeData.jsx";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin-home" element={<AdminHome />} />
        {/* <Route path="/change-password" element={<ChangePwd />} /> */}
        <Route path="/leave-request" element={<CreateAbsence />} />
        <Route path="/time-adjustment" element={<CreateTimeAdjustment />} />
        <Route path="/view-time-adjustment" element={<ViewTimeAdjustments />} />
        <Route
          path="/time-adjustment-details/:id"
          element={<TimeAdjustmentDetail />}
        />
        <Route path="/view-absences" element={<ViewAbsences />} />
        <Route path="/absence-details/:id" element={<AbsenceDetail />} />
        <Route path="/profile-page" element={<Profile />} />
        <Route path="/mentor-profile" element={<MentorProfile />} />

        <Route path="/upload-user-csv" element={<UploadUserCsv />} />
        <Route path="/upload-mentor-csv" element={<MentorRegisteration />} />

        <Route path="/clockin-clockout" element={<ClockinClockout />} />
        <Route path="/view-clockin-clockout" element={<ViewCicos />} />
        <Route
          path="/admin-view-time-adjustment"
          element={<AdminTimeAdjustments />}
        />
        <Route path="/admin-profile-page" element={<AdminProfile />} />
        <Route path="/admin-view-absences" element={<AdminAbsences />} />
        <Route path="/admin-view-cico" element={<AdminClockInClockOut />} />
        <Route
          path="/mentor-view-time-adjustments"
          element={<MentorGetAllTimeAdjustments />}
        />
        <Route
          path="/mentor-view-absences"
          element={<MentorGetAllAbsences />}
        />
        <Route
          path="/mentor-view-time-adjustment-details/:id"
          element={<MentorTimeAdjustments />}
        />
        <Route
          path="/time-adjustment-for-cico/:id"
          element={<TimeAdjustmentForCico />}
        />
        <Route
          path="/mentor-view-absences-details/:id"
          element={<MentorAbsences />}
        />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/admin-view-absences-details/:id"
          element={<AdminAbsenceDetail />}
        />
        <Route
          path="/admin-view-time-adjustment-details/:id"
          element={<AdminTimeAdjustmentDetail />}
        />
        <Route path="/admin-mentors" element={<Mentors />} />
        <Route path="/admin-trainees" element={<Trainees />} />
        <Route path="/admin-trainee-data/:rfid" element={<TraineeData />} />
        <Route path="/admin-mentor-data/:rfid" element={<MentorData />} />

        <Route path="/admin-adjustment-reason" element={<TimeAdjustmentReasons />}/>
        <Route path="/admin-add-adjustment-reason" element={<TimeAdjustmentReasonsNew />} />
        <Route path="/admin-adjustment-reason/:id" element={<EditTimeAdjustmentReason />} />

        <Route path="/admin-leave-type" element={<LeaveRequestTypes />} />
        <Route path="/admin-add-leave-type" element={<LeaveRequestTypesNew />} />
        <Route path="/admin-leave-type/:id" element={<LeaveRequestTypeEdit />} />
      </Routes>
    </div>
  );
}

export default App;
