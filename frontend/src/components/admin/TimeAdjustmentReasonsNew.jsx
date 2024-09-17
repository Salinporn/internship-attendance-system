import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "../../utils/toastNotifications.js";
import { lightTheme } from "../style.js";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";
import { useStyles } from "../style.js";
import { useNavigate } from "react-router-dom";
import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";

const TimeAdjustmentReasonsNew = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    reasonName: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/add-reason`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: formState.reasonName }),
      });

      const result = await response.json();

      if (response.ok) {
        toastSuccess("Reason added successfully!");
        setTimeout(() => {
          navigate("/admin-adjustment-reason");
        }, 2000);
      } else {
        toastError(result.message || "Failed to add reason");
      }
    } catch (error) {
      console.error("Error adding reason:", error);
      toastError("An error occurred. Please try again.");
    }
  };

  return (
    <RequireAuthAdmin>
      <React.Fragment>
        <CssBaseline />
        <ThemeProvider theme={lightTheme}>
          <AdminNavbar />
          <Container maxWidth="xl">
            <Grid
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
                  maxWidth: { md: "60%" },
                }}
              >
                <Paper
                  elevation={12}
                  sx={{
                    bgcolor: "black.900",
                    padding: "20px",
                    marginTop: "30vh",
                    marginBottom: "20px",
                    maxWidth: "80%",
                  }}
                >
                  <Grid container rowSpacing={3} columnSpacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h4" component="h4" gutterBottom>
                        New Time Adjustment Reason
                      </Typography>
                      <hr />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="reasonName"
                        variant="outlined"
                        label="Time Adjustment Reason"
                        value={formState.reasonName}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        className={classes.gradientButton}
                        variant="contained"
                        onClick={handleSubmit}
                      >
                        Submit
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

export default TimeAdjustmentReasonsNew;
