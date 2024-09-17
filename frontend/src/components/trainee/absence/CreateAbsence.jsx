import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AttachmentIcon from "@mui/icons-material/Attachment";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { toastError, toastWarn } from "../../../utils/toastNotifications.js";
import { useStyles, darkTheme } from "../../style.js";
import { LoaderComponent } from "../../../utils/loader.jsx";
import axios from "axios";

import { BACKEND_PORT, HOST } from "../../../utils/constants.jsx";
import { RequireAuthTrainee } from "../../../utils/requireAuth.jsx";
import TraineeNavbar from "../../navbar/TraineeNavbar.jsx";

const Absence = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const fileInput = React.useRef();

  // UTC+7; in mongodb, it's UTC+0 by default so we need to add 7 hours
  const date = new Date();
  console.log("date: ", date);
  const options = { timeZone: "Asia/Bangkok", hour12: true };
  const dateInThailand = date.toLocaleString("en-US", options);
  const [isLoading, setIsLoading] = useState(false);

  const [leavereasonError, setLeavereasonError] = useState(false);
  const [periodError, setPeriodError] = useState(false);
  const [leaveTypeError, setLeaveTypeError] = useState(false);
  const [subLeaveTypeError, setSubLeaveTypeError] = useState(false);

  const [fileSelected, setFileSelected] = useState(false);
  const [fetchLeaveType, setfetchLeaveType] = useState([]);
  const [fetchsubLeaveTypes, setfetchSubLeaveTypes] = useState([]);
  const [fetchPeriod, setFetchPeriod] = useState([]);
  const [rfid, setRfid] = useState(localStorage.getItem("rfid") || "");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [leaveType, setLeaveType] = useState("");
  const [subLeaveType, setSubLeaveType] = useState("");

  const [period, setPeriod] = useState("");
  const [leavereason, setleavereason] = useState("");
  const [mentorRfid, setmentorRfid] = useState("");
  const [fileName, setFileName] = React.useState(null);

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (fileName) {
      setSelectedFile(fileName);
    }
  }, [fileName]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (file && !allowedFileTypes.includes(file.type)) {
      toastWarn("Unsupported file type");
      event.target.value = null;
      return;
    }

    const name = file?.name;
    if (name) {
      setFileName(name);
    }
  };

  const handleLeaveTypeChange = (event) => {
    const leaveTypeId = event.target.value;
    setLeaveType(leaveTypeId);
    try {
      axios
        .get(`http://${HOST}:${BACKEND_PORT}/api/subleavetype/${leaveTypeId}`)
        .then((response) => setfetchSubLeaveTypes(response.data))
        .catch((error) =>
          console.error("Error fetching sub leave types:", error)
        );
    } catch (error) {
      console.log("Failed to fetch sub leave type: ", error);
    }
  };

  //fetch leave type
  const fetchLeaveTypes = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/leavetype-active`);
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const data = await response.json();
      setfetchLeaveType(data);
      console.log(data);
    } catch (error) {
      console.log("Failed to fetch leave type: ", error);
    }
  };

  //fetch period of time

  const fetchPeriodOfTime = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/period`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setFetchPeriod(data);
      console.log(data);
    } catch (error) {
      console.log("Failed to fetch period of time: ", error);
    }
  };

  const fetchMentorRfid = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/get-mentor/${rfid}`);
      if (!response.ok) {
        console.error("Failed to fetch mentor RFID:", response.statusText);
      }
      const mentorRfid = await response.json();
      setmentorRfid(mentorRfid.mentor_rfid);
      console.log(mentorRfid);
    } catch (error) {
      console.error("Failed to fetch mentor RFID:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchMentorRfid();
    fetchLeaveTypes();
    fetchPeriodOfTime();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "rfid":
        localStorage.setItem("rfid", value);
        break;
      case "startdate":
        setStartDate(value);
        break;
      case "enddate":
        setEndDate(value);
        break;
      case "period":
        setPeriod(value);
        break;
      case "leavereason":
        setleavereason(value);
        if (value) {
          setLeavereasonError(false);
        }
        break;
      case "subLeaveType":
        setSubLeaveType(value);
        break;
      default:
        break;
    }
  };

  const leaveTypesRequiringAttachment = [2, 3, 4, 6];
  const maxFileSizeInKB = 5242; // Maximum file size in KB

  const isEmpty = (value) =>
    value === "" || value === null || value === undefined;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = fileInput.current.files[0];

    if (file) {
      const fileSizeInKB = file.size / 1024;
      if (fileSizeInKB > maxFileSizeInKB) {
        toastWarn("File too large");
        return;
      }
    }

    const dateDiff =
      endDate.startOf("day").diff(startDate.startOf("day"), "day") + 1;
    const requiresAttachment =
      (leaveType === 1 && dateDiff >= 3) ||
      leaveTypesRequiringAttachment.includes(leaveType);

    if (requiresAttachment && !file) {
      toastError("Please attach a file");
      return;
    }
    if (leaveType === 3 && isEmpty(subLeaveType)) {
      toastError("Please select a sub leave type");
      return;
    }
    if (isEmpty(period)) {
      setPeriodError("Please select a period of time");
      return;
    }
    if (isEmpty(leaveType)) {
      setLeaveTypeError("Please select a leave type");
      return;
    }
    if (isEmpty(leavereason) || leavereason.length < 2) {
      setLeavereasonError(true);
      return;
    }

    const formData = new FormData();
    formData.append("rfid", rfid);
    formData.append("startDate", startDate.format("YYYY-MM-DD"));
    formData.append("endDate", endDate.format("YYYY-MM-DD"));
    formData.append("reason", leavereason);
    formData.append("type", leaveType);
    if (!isEmpty(subLeaveType)) {
      formData.append("subType", subLeaveType);
    }
    formData.append("period", period);
    formData.append("mentorRfid", mentorRfid);
    formData.append("approved", "pending");
    formData.append(
      "date",
      dayjs(dateInThailand).format("YYYY-MM-DD HH:mm:ss")
    );
    if (file) {
      formData.append("file", file);
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/absences`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }
      const data = await response.json();
      console.log(data);
      setTimeout(() => setIsLoading(false), 3000);
      navigate("/view-absences");
    } catch (error) {
      setIsLoading(false);
      const errorMessage = JSON.parse(error.message).message;
      toastError(errorMessage);
      console.log(errorMessage);
    }
  };
  return (
    <RequireAuthTrainee>
      <React.Fragment>
        <ThemeProvider theme={darkTheme}>
          {isLoading ? (
            <LoaderComponent />
          ) : (
            <div>
              <CssBaseline />
              <TraineeNavbar />
              <Container
                maxWidth="lg"
                // sx={{ background: "black.900", minHeight: "100vh", minWidth: "100vw" }}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  style={{ minHeight: "100vh" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      maxWidth: { md: "50%" },
                    }}
                  >
                    <Paper
                      elevation={12}
                      sx={{
                        // bgcolor: "black.900",
                        padding: "20px",
                        marginTop: "80px",
                        marginBottom: "20px",
                      }}
                    >
                      <Grid
                        container
                        rowSpacing={5}
                        columnSpacing={{ xs: 2, sm: 2, md: 2 }}
                      >
                        <Grid item xs={12} sx={{ marginTop: "20px" }}>
                          <Typography
                            sx={{
                              flex: "1 1 100%",
                              color: "#66ff00",
                            }}
                            variant="h6"
                            component="div"
                          >
                            Internship Leave Request
                          </Typography>
                          <Typography variant="subtitle1" component="div">
                            ระบบการลาของนักศึกษา
                          </Typography>

                          <hr className={classes.neonGradient} />
                        </Grid>

                        <Grid item xs={12} sx={{}}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer
                              components={["DatePicker", "DatePicker"]}
                            >
                              <DatePicker
                                name="startdate"
                                label="Start Date"
                                value={startDate}
                                onChange={(newDate) => setStartDate(newDate)}
                                slotProps={{ textField: { fullWidth: true } }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sx={{}}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer
                              components={["DatePicker", "DatePicker"]}
                            >
                              <DatePicker
                                name="enddate"
                                label="End Date"
                                value={endDate}
                                onChange={(newDate) => setEndDate(newDate)}
                                slotProps={{ textField: { fullWidth: true } }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            id="outlined-select-currency"
                            select
                            label="Period of Time"
                            defaultValue=""
                            fullWidth
                            name="period"
                            value={period}
                            onChange={handleInputChange}
                            error={periodError}
                            helperText={periodError}
                          >
                            {fetchPeriod.map((period) => (
                              <MenuItem 
                                key={period.id} 
                                value={period.id}
                                style={{ 
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  maxWidth: '100%',
                                }}
                              >
                                {period.period}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sx={{}}>
                          <TextField
                            required
                            id="outlined-select-currency"
                            select
                            label="Leave Type"
                            value={leaveType}
                            fullWidth
                            name="leaveType"
                            onChange={handleLeaveTypeChange}
                            error={leaveTypeError}
                            helperText={leaveTypeError}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                },
                              },
                            }}
                          >
                            {fetchLeaveType.map((option) => (
                              <MenuItem 
                                key={option.id} 
                                value={option.id}
                                style={{ 
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  maxWidth: '100%',
                                }}
                              >
                                {option.leaveType}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        {fetchsubLeaveTypes.length > 0 && (
                          <Grid item xs={12} sx={{}}>
                            <TextField
                              required
                              id="outlined-select-currency"
                              select
                              label="Choice of Personal Business Leave"
                              value={subLeaveType}
                              fullWidth
                              name="subLeaveType"
                              onChange={handleInputChange}
                              error={subLeaveTypeError}
                              helperText={subLeaveTypeError}
                            >
                              {fetchsubLeaveTypes.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.subtype}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        )}

                        <Grid item xs={12} sx={{}}>
                          <TextField
                            required={true}
                            id="outlined-basic"
                            label="Leave Reason"
                            variant="outlined"
                            fullWidth
                            multiline
                            value={leavereason}
                            name="leavereason"
                            onChange={handleInputChange}
                            error={leavereasonError}
                            helperText={
                              leavereasonError ? "Leave reason is required" : ""
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id="outlined-basic"
                            label="Attachment"
                            variant="outlined"
                            fullWidth
                            value={selectedFile ? selectedFile.name : ""}
                            helperText="Maximum file size: 5242 KB. Supported file types are .jpg, .jpeg, .png, .pdf"
                            InputLabelProps={{
                              shrink: selectedFile && selectedFile.name !== "",
                            }}
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    className={classes.gradientButton}
                                    component="label"
                                    htmlFor="file-upload"
                                  >
                                    <AttachmentIcon />
                                    <input
                                      required={true}
                                      ref={fileInput}
                                      id="file-upload"
                                      type="file"
                                      accept=".jpg,.jpeg,.png,.pdf"
                                      hidden
                                      onChange={(event) => {
                                        handleFileChange(event);
                                        setFileSelected(!!event.target.files[0]);
                                      }}
                                    />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sx={{}}>
                          <Stack direction="row" justifyContent="start">
                            <Button
                              className={classes.gradientButton}
                              variant="contained"
                              endIcon={<SendRoundedIcon />}
                              onClick={handleSubmit}
                            >
                              submit
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                </Grid>
              </Container>
            </div>
          )}
        </ThemeProvider>
        <ToastContainer />
      </React.Fragment>
    </RequireAuthTrainee>
  );
};

export default Absence;
