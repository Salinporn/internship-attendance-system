import React, { useState, useEffect } from "react";

import {
  Container,
  ThemeProvider,
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business"; // for department
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded"; // for intern ID
import PersonIcon from "@mui/icons-material/Person"; // for name
import Avatar from "@mui/material/Avatar";
import { useStyles, darkTheme } from "../style.js";
import CssBaseline from "@mui/material/CssBaseline";
import AccessibilityRoundedIcon from "@mui/icons-material/AccessibilityRounded";

import { stringAvatar } from "./Pfunction.js";
import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthTrainee } from "../../utils/requireAuth.jsx";
import TraineeNavbar from "../navbar/TraineeNavbar";

const Profile = () => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`http://${HOST}:${BACKEND_PORT}/api/intern/${localStorage.getItem("rfid")}`)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const handleLogout = async () => {
    try {
      // Call the backend endpoint to invalidate the token
      await fetch(`http://${HOST}:${BACKEND_PORT}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rfid: localStorage.getItem("rfid") }), // Send the RFID of the logged-in user
      });

      // Clear localStorage
      localStorage.clear();

      // Redirect to the login page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout failure if necessary
    }
  };
  return (
    <RequireAuthTrainee>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <TraineeNavbar />
        <Container
          component="main"
          maxWidth="lg"
          sx={{
            minHeight: "100vh",
            minWidth: "100vw",
            background: "linear-gradient(45deg,#fb1b59, #9b5afe, #5aa6fa)",
            // background:"#212121"
          }}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "100vh" }}
          >
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0px 0px 12px 2px #353839",
                  background: "#1b1b1b",
                }}
                elevation={3}
                style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}
              >
                <Avatar
                  {...(data &&
                    stringAvatar(`${data.first_name} ${data.last_name}`))}
                  sx={{
                    ...(data &&
                      stringAvatar(`${data.first_name} ${data.last_name}`).sx),
                    width: 100,
                    height: 100,
                    margin: "auto",
                    border: "3px #dcdcdc inset",
                    boxShadow: "0px 0px 5px 2px #808080",
                    color: "black",
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    margin: "0 auto",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  {data && (
                    <div key={data.id}>
                      <Box sx={{ display: "flex", alignItems: "start", mb: 1 }}>
                        <AccessibilityRoundedIcon sx={{ mr: 2 }} />
                        <Typography variant="body2">Intern</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "start", mb: 1 }}>
                        <CreditCardRoundedIcon sx={{ mr: 2 }} />
                        <Typography variant="body2">{data.rfid}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "start", mb: 1 }}>
                        <PersonIcon sx={{ mr: 2 }} />
                        <Typography variant="body2">
                          {data.first_name} {data.last_name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "start", mb: 1 }}>
                        <BusinessIcon sx={{ mr: 2 }} />
                        <Typography variant="body2">{data.department}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "start", mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 2 }} />
                        <Typography variant="body2">
                          {data.cloud_site}, {data.building}
                        </Typography>
                      </Box>
                    </div>
                  )}
                </Box>

                <Grid container justifyContent="center" spacing={2}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      className={classes.loginButton}
                      onClick={handleLogout}
                    >
                      log out
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </RequireAuthTrainee>
  );
};

export default Profile;
