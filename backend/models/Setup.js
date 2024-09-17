const TimeAdjReasons = require("./TimeAdjReasonsModel");
const LeaveType = require("./LeaveTypeModel");
const PeriodOfTime = require("./PeriodOfTimeModel");
const SubLeaveType = require("./SubLeaveTypeModel");

module.exports.populateTimeAdjReasons = async function () {
  try {
    await TimeAdjReasons.createTable();

    const count = await TimeAdjReasons.countReasons();
    if (count === 0) {
      const reasons = [
        "Forgot Badge (ลืมบัตร)",
        "Lost Badge (บัตรหาย)",
        "Forgot Record Time (ลืมบันทึกเวลา)",
        "System Error (ระบบมีปัญหา)",
        "Work at University assigned by Supervisor (หัวหน้างานมอบหมายฝึกงานที่มหาวิทยาลัย)",
        "Work outside assigned by Supervisor (หัวหน้างานมอบหมายฝึกงานนอกสถานที่)",
        "Work From Home (ปฏิบัติงานที่บ้าน)",
        "Virtual Internship - Remotely",
      ];

      for (const reason of reasons) {
        await TimeAdjReasons.insertReason(reason);
        console.log(`Saved reason: ${reason}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports.populateLeaveTypes = async function () {
  try {
    await LeaveType.createTable();

    const count = await LeaveType.countLeaveTypes();
    if (count === 0) {
      const leaveTypes = [
        "Sick Leave (ลาป่วย)",
        "Educational Leave (ลากิจเพื่อการศึกษา)",
        "Personal Business Leave (ลากิจธุระอันจำเป็น)",
        "Participation in funeral chanting (ลาเพื่อร่วมพิธีศพ)",
        "Personal Leave (ลากิจธุระส่วนตัว)",
        "Other (อื่นๆ)",
      ];

      const type_status = true;

      for (const leaveType of leaveTypes) {
        await LeaveType.insertLeaveType(leaveType, type_status);
        console.log(`Saved leave type: ${leaveType}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports.populatePeriodOfTime = async function () {
  try {
    await PeriodOfTime.createTable();

    const count = await PeriodOfTime.countPeriods();
    if (count === 0) {
      const periods = [
        "Full Day (เต็มวัน)",
        "Half Day - Morning (ครึ่งวันเช้า)",
        "Half Day - Afternoon (ครึ่งวันบ่าย)",
      ];

      for (const period of periods) {
        await PeriodOfTime.insertPeriod(period);
        console.log(`Saved period: ${period}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports.populateSubLeaveTypes = async function () {
  try {
    await SubLeaveType.createTable();
    const count = await SubLeaveType.countSubType();

    if (count === 0) {
      const leaveTypeId = 3; // id 3 is Personal Business Leave (ลากิจธุระอันจำเป็น)
      const subLeaveTypes = [
        "Visit for government (ติดต่อราชการ)",
        "Calamity leave (การลาได้รับภัยพิบัติตามธรรมชาติ)",
        "Take care of family member (บุคคลในครอบครัวเจ็บป่วย)",
      ];
      const subtype_status = true;
      for (const subLeaveType of subLeaveTypes) {
        await SubLeaveType.insertSubLeaveType(leaveTypeId, subLeaveType, subtype_status);
        console.log(`Saved sub leave type: ${subLeaveType}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};
