import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useStyles } from "../style.js";

import {
  toastError,
  toastSuccess,
} from "../../utils/toastNotifications.js";
import { lightTheme } from "../style.js";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";
import AdminNavbar from "../navbar/AdminNavbar.jsx";

const TraineeData = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { rfid } = useParams();
  console.log("rfid: ", rfid);

  // UTC+7; in mongodb, it's UTC+0 by default so we need to add 7 hours
  const date = new Date();
  console.log("date: ", date);
  const options = { timeZone: "Asia/Bangkok", hour12: true };
  const dateInThailand = date.toLocaleString("en-US", options);
  const [data, setData] = React.useState([]);

  const [formState, setFormState] = useState({
    id: "",
    rfid: "",
    mentor_rfid: "",
    first_name: "",
    last_name: "",
    degree: "",
    major: "",
    university: "",
    start_date: "",
    end_date: "",
    email: "",
    pwd: "",
    passwordUpdates: "",
    department: "",
    cloud_site: "",
    building: "",
    birth_date: "",
  });

  //fecth data from backend
  const fetchTrainee = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/intern/${rfid}`);
      const jsonData = await response.json();
      setFormState(jsonData);
      console.log(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTrainee();
  }, []);

  const handleChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/update-intern/${rfid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        }
      );
      const jsonData = await response.json();
      console.log(jsonData);
      if (response.status === 400) {
        toastError(jsonData.message);
      } else {
        toastSuccess("Changes saved successfully");
        setTimeout(() => {
          navigate("/admin-trainees");
        }, 2000);
      }
    } catch (err) {
      console.error(err.message);
      toastError(err.message);
    }
  };

  return (
    <RequireAuthAdmin>
      <React.Fragment>
        <ThemeProvider theme={lightTheme}>
          <AdminNavbar />
          <CssBaseline />
          <Container
            maxWidth="xl"
            sx={{
              minHeight: "100vh",
              minWidth: "100vw",
            }}
          >
            <Grid
              marginBottom={6}
              container
              direction="column"
              justifyContent="start"
              alignItems="center"
              style={{ minHeight: "100vh" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: { md: "80%" },
                }}
              >
                <Paper
                  elevation={12}
                  sx={{
                    bgcolor: "black.900",
                    padding: "20px",
                    marginTop: "100px",
                    marginBottom: "20px",
                  }}
                >
                  <Grid container rowSpacing={3} columnSpacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="h4"
                        component="h4"
                        gutterBottom
                        sx={{}}
                      >
                        Internship Record
                      </Typography>

                      <hr />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        name="rfid"
                        label="Intern RFID"
                        variant="filled"
                        value={formState && formState.rfid}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="filled-basic"
                        label="First Name"
                        name="first_name"
                        variant="filled"
                        value={formState && formState.first_name}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="filled-basic"
                        label="Last Name"
                        name="last_name"
                        variant="filled"
                        value={formState && formState.last_name}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Birth Date"
                          value={
                            formState.birth_date ? dayjs(formState.birth_date) : null
                          }
                          onChange={(newValue) => {
                            setFormState({
                              ...formState,
                              birth_date: newValue ? newValue.format() : null,
                            });
                          }}
                          slots={{
                            textField: (params) => (
                              <TextField variant="filled" fullWidth {...params} />
                            ),
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        id="filled-basic"
                        label="Degree"
                        name="degree"
                        variant="filled"
                        value={formState && formState.degree}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        id="filled-basic"
                        label="Major"
                        name="major"
                        variant="filled"
                        value={formState && formState.major}
                        onChange={handleChange}
                        v
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        id="filled-basic"
                        label="University"
                        name="university"
                        variant="filled"
                        value={formState && formState.university}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Start Date"
                          value={
                            formState.start_date
                              ? dayjs(formState.start_date)
                              : null
                          }
                          onChange={(newValue) => {
                            setFormState({
                              ...formState,
                              start_date: newValue ? newValue.format() : null,
                            });
                          }}
                          slots={{
                            textField: (params) => (
                              <TextField variant="filled" fullWidth {...params} />
                            ),
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="End Date"
                          value={
                            formState.end_date ? dayjs(formState.end_date) : null
                          }
                          onChange={(newValue) => {
                            setFormState({
                              ...formState,
                              end_date: newValue ? newValue.format() : null,
                            });
                          }}
                          slots={{
                            textField: (params) => (
                              <TextField variant="filled" fullWidth {...params} />
                            ),
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="filled-basic"
                        variant="filled"
                        label="Email"
                        name="email"
                        value={formState && formState.email}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="filled-basic"
                        label="Mentor"
                        name="mentor_rfid"
                        className={classes.customTextField}
                        variant="filled"
                        value={formState && formState.mentor_rfid}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        id="filled-basic"
                        label="Department"
                        name="department"
                        variant="filled"
                        value={formState && formState.department}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        id="filled-basic"
                        label="Cloud Site"
                        name="cloud_site"
                        variant="filled"
                        value={formState && formState.cloud_site}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        id="filled-basic"
                        label="Building"
                        name="building"
                        variant="filled"
                        value={formState && formState.building}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        className={classes.gradientButton}
                        onClick={saveChanges}
                        sx={{ mt: 3 }}
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Container>
        </ThemeProvider>

        <ToastContainer />
      </React.Fragment>
    </RequireAuthAdmin>
  );
};

export default TraineeData;
