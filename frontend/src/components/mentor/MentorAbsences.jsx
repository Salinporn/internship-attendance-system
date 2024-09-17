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
import moment from "moment";
import MentorNavbar from "../navbar/MentorNavbar.jsx";

import {
  toastWarn,
  toastInfo,
  toastSuccess,
  toastError,
} from "../../utils/toastNotifications.js";
import { useStyles, darkTheme, lightTheme } from "../style.js";
import FileViewer from "../../utils/FileViewer.jsx";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthMentor } from "../../utils/requireAuth.jsx";

const AbsenceDoc = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);

  // UTC+7; in mongodb, it's UTC+0 by default so we need to add 7 hours
  const date = new Date();
  console.log("date: ", date);
  const options = { timeZone: "Asia/Bangkok", hour12: true };
  const dateInThailand = date.toLocaleString("en-US", options);

  const approvalDate = dayjs(dateInThailand).format("YYYY-MM-DD HH:mm:ss");
  const [mentorRemark, setMentorRemark] = useState("");
  const [openAprrove, setOpenApprove] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);
  const [showImage, setShowImage] = useState(false);
  let { id } = useParams();

  const handleFileClick = () => {
    if (!data[0].filePath) {
      toastInfo("No attachment found");
    } else {
      setShowImage(!showImage);
    }
  };

  //fecth data from backend
  const fetchAbsence = async () => {
    try {
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/get-new-absence-byid/${id}`
      );
      const jsonData = await response.json();
      setData(jsonData);
      console.log(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleClickApprove = () => {
    setOpenApprove(!openAprrove);
  };

  const handleClickReject = () => {
    setOpenReject(!openReject);
  };

  const handleApprove = async (id, remark) => {
    const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/absences/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        approved: "approved",
        mentorRemark: remark,
        approvalDate: approvalDate,
      }),
    });
    if (!response.ok) {
      toastError("Error");
    } else {
      await toastSuccess("Approved");
      navigate("/mentor-view-absences");
    }
    const data = await response.json();
    console.log(data);
  };

  const handleReject = async (id, remark) => {
    const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/absences/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        approved: "rejected",
        mentorRemark: remark,
        approvalDate: approvalDate,
      }),
    });

    if (!response.ok) {
      toastError("Error");
    } else {
      await toastSuccess("Submit Successfully");
      navigate("/mentor-view-absences");
    }

    const data = await response.json();
    console.log(data);
  };
  useEffect(() => {
    fetchAbsence();
  }, []);

  return (
    <RequireAuthMentor>
      <div>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <MentorNavbar />
          <Container
            maxWidth="lg"
            sx={{

              minHeight: "100vh",
              minWidth: "100vw",
            }}
          >
            <Grid
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
                  maxWidth: { md: "50%" }
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    bgcolor: "black.900",
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
                        View Event: Internship Leave request
                      </Typography>
                      <Typography variant="subtitle1" component="div">
                        ข้อมูลการส่งคําร้องลาของนักศึกษา
                      </Typography>
                      <hr className={classes.neonGradient} />
                    </Grid>
                    <br></br>
                    <Grid item xs={12} sx={{}}>
                      <TextField
                        id="outlined-start-adornment"
                        //   sx={{ m: 1, width: "25ch" }}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Intern ID:
                            </InputAdornment>
                          ),
                        }}
                        value={data[0] && data[0].rfid}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
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
                              "MM/DD/YYYY"
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
                              "MM/DD/YYYY"
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
                              Period Of Time:
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={data[0] && data[0].period}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{}}>
                      <TextField
                        id="outlined-start-adornment"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Leave Type:
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={data[0] && data[0].leaveType}
                      />
                    </Grid>
                    {data[0] && data[0].subtype && (
                      <Grid item xs={12}>
                        <TextField
                          id="outlined-start-adornment"
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start"></InputAdornment>
                            ),
                          }}
                          inputProps={{
                            style: { textAlign: "center" },
                          }}
                          value={data[0] && data[0].subtype}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12} sx={{}}>
                      <TextField
                        id="outlined-start-adornment"
                        sx={{ mb: 2 }}
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
                        value={data[0] && data[0].reason ? data[0].reason : "-"}
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
                color="success"
                onClick={() => {
                  if (mentorRemark.trim() === "") {
                    toastWarn("Please enter a remark");
                  } else {
                    handleApprove(id, mentorRemark);
                    handleClickApprove();
                  }
                }}
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
      </div>
    </RequireAuthMentor>
  );
};

export default AbsenceDoc;
