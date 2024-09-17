const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "E:/Time_attendance/server/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const csvUpload = multer();

const {
  getAllMentors,
  getAdminByRfid,
  getMentor,
  deleteMentor,
  updateMentor,
  getTrainee,
  getAllTrainees,

  updateTrainee,
  getMentorRfid,
  uploadUserCSV,
  uploadMentorCSV,
  updateTraineetorAccountStatus,
  updateMentorAccountStatus,
} = require("../controllers/UserController");

const {
  createClockinClockout,
  updateClockinClockout,
  getClockinClockoutbyRfid,
  getClockinClockoutbyId,
  getNewCico,
} = require("../controllers/ClockinOutController");
const {
  createTimeAdjustment,
  updateTimeAdjustment,
  getTimeAdjustmentByMentorRfid,
  getNewTimeAdjustmentsByRfid,
  getNewTimeAdjustmentsById,
  getNewTimeAdjustments,
} = require("../controllers/TimeAdjustmentController");

const {
  createAbsence,
  getAllAbsences,
  updateAbsence,
  getTimeAdjustmentReasons,
  getLeaveTypes,
  getTimeAdjustmentReasonById,
  getTimeAdjustmentReasonsActive,
  getPeriodOfTime,
  getPeriodOfTimeById,
  getLeaveTypeById,
  getFile,
  getAllAbsencesByRfid,
  getNewAbsenceById,
  getAbsencesByMentor,
  getSubLeaveTypes,
  updateTimeAdjustmentReason,
  createTimeAdjustmentReason,
  getLeaveTypesWithSubtypes,
  getLeaveTypesWithSubtypesById,
  updateLeaveTypesWithSubtypes,
  createLeaveType,
  updateAdjReasonStatus,
  updateLeaveTypeStatus,
  updateSubTypeStatus,
  getLeaveTypesActive,
} = require("../controllers/AbsenceController");

const router = express.Router();

// admin
router.get("/admin/:rfid", getAdminByRfid);

router.get("/mentors", getAllMentors); // admin
router.get("/mentor/:rfid", getMentor); // profile
router.get("/get-mentor/:rfid", getMentorRfid);
router.patch("/update-mentor/:rfid", updateMentor);

// user (trainee, mentor)
router.get("/get-trainees", getAllTrainees);
router.get("/intern/:rfid", getTrainee);
router.patch("/update-intern/:rfid", updateTrainee);

// clockin clockout
router.get("/get-new-cico", getNewCico);
router.get("/clockin-clockouts/:rfid", getClockinClockoutbyRfid);
router.get("/clockin-clockout-by-id/:id", getClockinClockoutbyId);
router.post("/clockin-clockout", createClockinClockout);
router.post("/clockin-clockout/:rfid", updateClockinClockout);

// time adjustment
router.get(
  "/get-new-time-adjustments-byrfid/:rfid",
  getNewTimeAdjustmentsByRfid
); // intern
router.get("/time-adjustments-by-mentor/:rfid", getTimeAdjustmentByMentorRfid); // mentor
router.get("/get-new-time-adjustments", getNewTimeAdjustments); // admin
router.get("/get-new-time-adjustments-byid/:id", getNewTimeAdjustmentsById); // 3 actorsn
router.post(
  "/time-adjustments", 
  upload.single("file"), 
  createTimeAdjustment); //intern
router.patch("/time-adjustments/:id", updateTimeAdjustment); // mentor approve or reject

// absence
router.get("/get-all-absences", getAllAbsences); // admin
router.get("/get-absences-byrfid/:rfid", getAllAbsencesByRfid); // intern
router.get("/get-new-absence-byid/:id", getNewAbsenceById); // 3 actors
router.get("/get-absences-by-mentor/:rfid", getAbsencesByMentor); // mentor
router.post(
  "/absences",
  upload.single("file"),
  (req, res, next) => {
    console.log(req.file); // Log the file
    console.log(req.body); // Log the body
    next();
  },
  createAbsence
); // intern
router.patch("/absences/:id", updateAbsence); // mentor approve or reject

// get leave type and reason
router.get("/leavetype", getLeaveTypes);
router.get("/leavetype-active", getLeaveTypesActive)
router.get("/leavetype/:id", getLeaveTypeById);
router.get("/reason", getTimeAdjustmentReasons);
router.get("/reason/:id", getTimeAdjustmentReasonById);
router.get("/reason-active", getTimeAdjustmentReasonsActive);
router.get("/subleavetype/:id", getSubLeaveTypes);
router.get("/leavetype-subtype", getLeaveTypesWithSubtypes);
router.get("/leavetype-subtype/:id", getLeaveTypesWithSubtypesById);

// admin update edited reason and leave type
router.patch("/update-reason/:id", updateTimeAdjustmentReason);
router.patch("/update-leavetype-subtype/:id", updateLeaveTypesWithSubtypes);

// admin add new reason
router.post("/add-reason", createTimeAdjustmentReason);
router.post("/add-leavetype", createLeaveType);

// get period of time
router.get("/period", getPeriodOfTime);
router.get("/period/:id", getPeriodOfTimeById);

// csv file
router.post("/upload-user-csv", csvUpload.single("file"), uploadUserCSV); // intern
router.post("/upload-mentor-csv", csvUpload.single("file"), uploadMentorCSV); // mentor

// get file
router.get("/file/*", getFile);

// account status
router.patch("/update-trainee-account-status/:rfid", updateTraineetorAccountStatus);
router.patch("/update-mentor-account-status/:rfid", updateMentorAccountStatus);

// admin update edited reason and leave type
router.patch("/update-reason-status/:id", updateAdjReasonStatus);
router.patch("/update-leavetype-status/:id", updateLeaveTypeStatus);
router.patch("/update-subleavetype-status/:id", updateSubTypeStatus);

module.exports = router;
