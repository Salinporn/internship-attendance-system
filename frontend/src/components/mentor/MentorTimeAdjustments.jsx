// details in each document
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import moment from "moment";
import AttachmentIcon from "@mui/icons-material/Attachment";
import InputAdornment from "@mui/material/InputAdornment";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import MentorNavbar from "../navbar/MentorNavbar.jsx";

import {
  toastSuccess,
  toastError,
  toastInfo,
  toastWarn,
} from "../../utils/toastNotifications.js";
import { useStyles, darkTheme, lightTheme } from "../style.js";
import FileViewer from "../../utils/FileViewer.jsx";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthMentor } from "../../utils/requireAuth.jsx";

const TimeAdjustmentDoc = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  // UTC+7; in mongodb, it's UTC+0 by default so we need to add 7 hours
  const date = new Date();
  console.log("date: ", date);
  const options = { timeZone: "Asia/Bangkok", hour12: true };
  const dateInThailand = date.toLocaleString("en-US", options);

  const approvalDate = dayjs(dateInThailand).format("YYYY-MM-DD HH:mm:ss");

  const [data, setData] = React.useState([]);
  const [mentorRemark, setMentorRemark] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [openAprrove, setOpenApprove] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);
  let { id } = useParams();

  const handleClickApprove = () => {
    setOpenApprove(!openAprrove);
  };

  const handleClickReject = () => {
    setOpenReject(!openReject);
  };
  //fecth data from backend
  const fetchTimeAdjustments = async () => {
    try {
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/get-new-time-adjustments-byid/${id}`
      );
      const jsonData = await response.json();
      setData(jsonData);
      console.log(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleFileClick = () => {
    if (!data[0].filePath) {
      toastInfo("No attachment found");
    } else {
      setShowImage(!showImage);
    }
  };

  const handleApprove = async (id, remark) => {
    const response = await fetch(
      `http://${HOST}:${BACKEND_PORT}/api/time-adjustments/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approved: "approved",
          mentorRemark: remark,
          approvalDate: approvalDate,
        }),
      }
    );
    if (!response.ok) {
      toastError("Error");
    } else {
      await toastSuccess("Approved");
      navigate("/mentor-view-time-adjustments");
    }
    const data = await response.json();
    console.log(data);
  };

  const handleReject = async (id, remark) => {
    const response = await fetch(
      `http://${HOST}:${BACKEND_PORT}/api/time-adjustments/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approved: "rejected",
          mentorRemark: remark,
          approvalDate: approvalDate,
        }),
      }
    );

    if (!response.ok) {
      toastError("Error");
    } else {
      await toastSuccess("Submit Successfully");
      navigate("/mentor-view-time-adjustments");
    }

    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    fetchTimeAdjustments();
  }, []);

  return (
    <RequireAuthMentor>
      <React.Fragment>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <MentorNavbar />
          <Container
            maxWidth="lg"
            sx={{
              background: "black.900",
              minHeight: "100vh",
              minWidth: "100vw",
            }}
          >
            <Grid
              marginBottom={6}
              container
              direction="column"
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
                  elevation={2}
                  sx={{
                    padding: "20px",
                    marginTop: "100px",
                    marginBottom: "20px",
                  }}
                >
                  <Grid
                    container
                    rowSpacing={2}
                    columnSpacing={{ xs: 2, sm: 2, md: 2 }}
                  >
                    <Grid item xs={12} sx={{ marginTop: "10px" }}>
                      <Typography
                        sx={{
                          flex: "1 1 100%",
                        }}
                        variant="h6"
                        component="div"
                      >
                        View Event: Internship Time adjustment Request
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ pb: "10px" }}
                      >
                        ข้อมูลการส่งคําร้องบันทึกเวลาฝึกงานของนักศึกษา
                      </Typography>
                      <hr className={classes.neonGradient} />
                    </Grid>
                    <br></br>
                    <Grid item xs={12} sx={{}}>
                      <TextField
                        id="outlined-start-adornment"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Intern ID:
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={data[0] && data[0].rfid}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{}}>
                      <TextField
                        id="outlined-start-adornment"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Name:
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={data[0] && data[0].trainee_fullname}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{}}>
                      <TextField
                        id="outlined-start-adornment"
                        //   sx={{ m: 1, width: "25ch" }}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Start Date:
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={
                          data[0]
                            ? moment(data[0] && data[0].startDate).format(
                              "MM/DD/YYYY, hh:mm A"
                            )
                            : "-"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sx={{}}>
                      <TextField
                        id="outlined-start-adornment"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              End Date:
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={
                          data[0]
                            ? moment(data[0] && data[0].endDate).format(
                              "MM/DD/YYYY, hh:mm A"
                            )
                            : "-"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sx={{}}>
                      <TextField
                        id="outlined-start-adornment"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Reason:
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={data[0] && data[0].reason}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{}}>
                      <TextField
                        id="outlined-start-adornment"
                        sx={{ mb: 2 }}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Trainee Remark:
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={
                          data[0] && data[0].traineeRemark
                            ? data[0].traineeRemark
                            : "-"
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sx={{}}>
                      <TextField
                        id="outlined-start-adornment"
                        sx={{ mb: 2 }}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Attachment:
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleFileClick}>
                                <AttachmentIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value="Click to view attachment"
                      />
                      {showImage && <FileViewer filePath={data[0].filePath} />}
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        id="outlined-start-adornment"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Status:
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={
                          data[0] && data[0].approved ? data[0].approved : "-"
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
              <Box display="flex" justifyContent="center" width="100%">
                <Stack direction="row" spacing={4}>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={handleClickReject}
                  >
                    Reject
                  </Button>
                  <Button
                    color="success"
                    variant="contained"
                    onClick={handleClickApprove}
                  >
                    Approve
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Container>
        </ThemeProvider>
        <ThemeProvider theme={lightTheme}>
          <Dialog open={openAprrove} onClose={handleClickApprove}>
            <DialogTitle>Comment</DialogTitle>
            <DialogContent>
              <DialogContentText>For example is Approved</DialogContentText>
              <TextField
                autoFocus
                id="name"
                fullWidth
                variant="standard"
                value={mentorRemark}
                onChange={(e) => setMentorRemark(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClickApprove();
                }}
                sx={{ color: "red" }}
              >
                cancel
              </Button>
              <Button
                onClick={() => {
                  if (mentorRemark.trim() === "") {
                    toastWarn("Please enter a remark");
                  } else {
                    handleApprove(id, mentorRemark);
                    handleClickApprove();
                  }
                }}
                sx={{ color: "green" }}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openReject} onClose={handleClickReject}>
            <DialogTitle>Comment</DialogTitle>
            <DialogContent>
              <DialogContentText>For example is Rejected</DialogContentText>
              <TextField
                required
                autoFocus
                id="name"
                fullWidth
                variant="standard"
                value={mentorRemark}
                onChange={(e) => {
                  console.log("log", e.target.value);
                  setMentorRemark(e.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClickReject();
                }}
                sx={{ color: "red" }}
              >
                cancel
              </Button>
              <Button
                onClick={() => {
                  if (mentorRemark.trim() === "") {
                    toastWarn("Please enter a remark");
                  } else {
                    handleReject(id, mentorRemark);
                    handleClickReject();
                  }
                }}
                sx={{ color: "green" }}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
        <ToastContainer />
      </React.Fragment>
    </RequireAuthMentor>
  );
};

export default TimeAdjustmentDoc;
