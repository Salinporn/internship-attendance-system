import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AttachmentIcon from "@mui/icons-material/Attachment";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useStyles, darkTheme } from "../../style.js";
import { toastError, toastWarn } from "../../../utils/toastNotifications.js";
import { LoaderComponent } from "../../../utils/loader.jsx";

import { BACKEND_PORT, HOST } from "../../../utils/constants.jsx";

export default  TimeAdjustmentClockinOut = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const fileInput = React.useRef();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // UTC+7; in mongodb, it's UTC+0 by default so we need to add 7 hours
  const date = new Date();
  console.log("date: ", date);
  const options = { timeZone: "Asia/Bangkok", hour12: true };
  const dateInThailand = date.toLocaleString("en-US", options);

  const [isLoading, setIsLoading] = useState(false);

  const [fileSelected, setFileSelected] = useState(false);

  const [remarkError, setRemarkError] = useState(false);
  const [reasonError, setReasonError] = useState(false);
  const [rfid, setRfid] = useState(localStorage.getItem("rfid") || "");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [reasons, setReasons] = useState("");
  const [fetchreasons, setFetchReasons] = useState([]);
  const [traineeRemark, setTraineeRemark] = useState();
  const [approved, setApproved] = useState("pending");
  const [mentorRfid, setmentorRfid] = useState();
  const [fileName, setFileName] = useState("");

  //fecth data from backend
  const fetchReasons = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/reason`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      setFetchReasons(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch reasons:", error);
    }
  };

  const fetchMentorRfid = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/mentor/${rfid}`);
      if (!response.ok) {
        console.error("Failed to fetch mentor RFID:", response.statusText);
        return null;
      }
      const mentorRfid = await response.json();
      setmentorRfid(mentorRfid.mentor_rfid);
      console.log("mentor id: ", mentorRfid);
      return mentorRfid;
    } catch (error) {
      console.error("Failed to fetch mentor RFID:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchReasons();
    fetchMentorRfid();
  }, []);

  // handle chage of input fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "rfid":
        localStorage.setItem("rfid", value);
        break;
      case "reasons":
        setReasons(value);

        break;
      case "traineeRemark":
        setTraineeRemark(value);

        break;
      default:
        break;
    }
  };

  // Handle change for DateTimePicker
  const handleDateChange = (newValue, name) => {
    switch (name) {
      case "startDate":
        setStartDate(newValue);
        break;
      case "endDate":
        setEndDate(newValue);
        break;
      default:
        break;
    }
  };

  // Handle change for file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
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

  // Handle submit
  const onSubmit = async (event) => {
    event.preventDefault();

    if (!traineeRemark || traineeRemark.length < 2) {
      setRemarkError("Please enter a remark");
      return;
    }
    if (!reasons) {
      setReasonError("Please select a reason");
    }
    const file = fileInput.current.files[0];

    const formData = new FormData();
    formData.append("rfid", rfid);
    formData.append("startDate", startDate.format("YYYY-MM-DD HH:mm:ss"));
    formData.append("endDate", endDate.format("YYYY-MM-DD HH:mm:ss"));
    formData.append("startDateWithNoTime", startDate.format("YYYY-MM-DD"));
    formData.append("endDateWithNoTime", endDate.format("YYYY-MM-DD"));
    formData.append("reasons", reasons);
    formData.append("traineeRemark", traineeRemark);
    formData.append("approved", approved);
    formData.append("mentorRfid", mentorRfid);
    formData.append(
      "date",
      dayjs(dateInThailand).format("YYYY-MM-DD HH:mm:ss")
    );
    formData.append("file", file);

    if (file) {
      // Check file size
      const fileSizeInKB = file.size / 1024;
      const maxFileSizeInKB = 5242; // Maximum file size in KB

      if (fileSizeInKB > maxFileSizeInKB) {
        toastWarn("File too large");
        return;
      }
    }

    // log data
    console.log("token", localStorage.getItem("token"));
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    //////////////////////////////////////////////

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/time-adjustments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const message = await response.text();
        const error = JSON.parse(message);
        if (error.error.includes("foreign key constraint fails")) {
          toastError("Mentor RFID does not exist");
        } else {
          throw new Error(message);
        }
      } else {
        const data = await response.json();
        console.log(data);

        setTimeout(() => setIsLoading(false), 3000);
        navigate("/view-time-adjustment");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      toastError("Failed!");
    }
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme}>
        {isLoading ? (
          <LoaderComponent />
        ) : (
          <div>
            <CssBaseline />
            <Container
              maxWidth="lg"
              sx={{
                background: "black.900",
                minHeight: "100vh",
                minWidth: "100vw",
              }}
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
                      bgcolor: "black.900",
                      padding: "20px",
                      marginTop: "20px",
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

                            color: "#87cefa",
                          }}
                          variant="h6"
                          component="div"
                        >
                          Internship Time Adjustment Request
                        </Typography>
                        <Typography variant="subtitle1" component="div">
                          ระบบการบันทึกเวลาฝึกงานของนักศึกษา
                        </Typography>
                        <hr className={classes.neonGradient} />
                      </Grid>
                      <Grid item xs={12} sx={{}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DateTimePicker"]}>
                            <DateTimePicker
                              label="Start Date"
                              value={startDate}
                              onChange={(newValue) =>
                                handleDateChange(newValue, "startDate")
                              }
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sx={{}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DateTimePicker"]}>
                            <DateTimePicker
                              label="End Date"
                              value={endDate}
                              onChange={(newValue) =>
                                handleDateChange(newValue, "endDate")
                              }
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </Grid>

                      <Grid item xs={12} sx={{}}>
                        <TextField
                          required
                          id="outlined-select-currency"
                          select
                          label="Adjustment Reason"
                          fullWidth
                          value={reasons}
                          name="reasons"
                          onChange={handleInputChange}
                          error={reasonError}
                          helperText={reasonError}
                        >
                          {fetchreasons.map((reason) => (
                            <MenuItem key={reason.id} value={reason.id}>
                              {reason.reason}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sx={{}}>
                        <TextField
                          required
                          id="outlined-basic"
                          label="Remarks"
                          variant="outlined"
                          fullWidth
                          multiline
                          value={traineeRemark}
                          name="traineeRemark"
                          onChange={handleInputChange}
                          error={remarkError}
                          helperText={remarkError}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          id="outlined-basic"
                          label="Attachment"
                          variant="outlined"
                          fullWidth
                          value={fileName}
                          helperText="Maximum file size: 5242 KB. Supported file types are .jpg, .jpeg, .png, .pdf"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  className={classes.gradientButton}
                                  component="label"
                                  htmlFor="file-upload"
                                >
                                  <AttachmentIcon />
                                  <input
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
                            onClick={onSubmit}
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
  );
};


