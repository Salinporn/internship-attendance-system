import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

import FileViewer from "../../../utils/FileViewer.jsx";
import { useStyles, darkTheme } from "../../style.js";
import { toastInfo } from "../../../utils/toastNotifications.js";

import { BACKEND_PORT, HOST } from "../../../utils/constants.jsx";
import { RequireAuthTrainee } from "../../../utils/requireAuth.jsx";
import TraineeNavbar from "../../navbar/TraineeNavbar.jsx";

const TimeAdjustment = () => {
  const classes = useStyles();
  const [data, setData] = React.useState([]);
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
  const fetchTimeAdjustments = async () => {
    try {
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/get-new-time-adjustments-byid/${id}`
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTimeAdjustments();
  }, []);

  return (
    <RequireAuthTrainee>
      <React.Fragment>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <TraineeNavbar />
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
                    marginTop: "80px",
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
                            ? moment(data[0].startDate).format(
                                "DD/MM/YYYY, hh:mm A"
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
                            ? moment(data[0].endDate).format(
                                "DD/MM/YYYY, hh:mm A"
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
                              Remark:
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={data[0] && data[0].traineeRemark}
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

                    {data.approved === "approved" ||
                    data.approved === "rejected" ? (
                      <>
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
                            value={data[0] && data[0].approved}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id="outlined-start-adornment"
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  Mentor Remark:
                                </InputAdornment>
                              ),
                            }}
                            inputProps={{
                              style: { textAlign: "center" },
                            }}
                            value={data[0] && data[0].mentorRemark}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id="outlined-start-adornment"
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  Approval Date:
                                </InputAdornment>
                              ),
                            }}
                            inputProps={{
                              style: { textAlign: "center" },
                            }}
                            value={moment(data[0].approvedDate).format(
                              "MM/DD/YYYY, hh:mm A"
                            )}
                          />
                        </Grid>
                      </>
                    ) : null}
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Container>
        </ThemeProvider>
        <ToastContainer />
      </React.Fragment>
    </RequireAuthTrainee>
  );
};

export default TimeAdjustment;
