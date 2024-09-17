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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

import { toastInfo } from "../../utils/toastNotifications.js";
import { useStyles, lightTheme } from "../style.js";
import FileViewer from "../../utils/FileViewer.jsx";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";
import AdminNavbar from "../navbar/AdminNavbar.jsx";

const AbsenceDetail = () => {
  const classes = useStyles();
  const [data, setData] = React.useState([]);

  // UTC+7; in mongodb, it's UTC+0 by default so we need to add 7 hours
  const date = new Date();
  console.log("date: ", date);
  const options = { timeZone: "Asia/Bangkok", hour12: true };
  const dateInThailand = date.toLocaleString("en-US", options);

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

  useEffect(() => {
    fetchAbsence();
  }, []);

  return (
    <RequireAuthAdmin>
      <div>
        <ThemeProvider theme={lightTheme}>
          <AdminNavbar />
          <CssBaseline />
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
                    <Grid item xs={12} sx={{ marginTop: "20px" }}>
                      <Typography variant="h5" component="h1" gutterBottom>
                        View Event: Internship Leave request
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
                              Site:
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        value={data[0] && data[0].cloud_site}
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
                          data[0] && data[0]
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
            </Grid>
          </Container>
        </ThemeProvider>
        <ToastContainer />
      </div>
    </RequireAuthAdmin>
  );
};

export default AbsenceDetail;
