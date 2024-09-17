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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

import { toastInfo } from "../../../utils/toastNotifications.js";
import { useStyles, darkTheme } from "../../style.js";
import FileViewer from "../../../utils/FileViewer.jsx";

import { BACKEND_PORT, HOST } from "../../../utils/constants.jsx";
import { RequireAuthTrainee } from "../../../utils/requireAuth.jsx";
import TraineeNavbar from "../../navbar/TraineeNavbar.jsx";

const AbsenceDetail = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const [leaveType, setLeavetype] = useState("");
  const [period, setPeriod] = useState("");
  const [traineeName, setTraineeName] = useState("");
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
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchAbsence();
  }, []);

  return (
    <RequireAuthTrainee>
      <div>
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
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={data[0] && data[0].rfid}
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
                            ? moment(data[0].startDate).format("MM/DD/YYYY")
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
                            ? moment(data[0].endDate).format("MM/DD/YYYY")
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
                            value={
                              data[0] && data[0].mentorRemark
                                ? data[0].mentorRemark
                                : "-"
                            }
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
                            value={dayjs(data[0] && data[0].approvalDate).format(
                              "MM/DD/YYYY, HH:mm:ss"
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
      </div>
    </RequireAuthTrainee>
  );
};

export default AbsenceDetail;
