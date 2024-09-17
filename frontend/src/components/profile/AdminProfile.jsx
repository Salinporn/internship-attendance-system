import React, { useState, useEffect } from "react";

import {
  Container,
  ThemeProvider,
  Box,
  Paper,
  Grid,
  Typography,
  Tooltip,
} from "@mui/material";
import { useStyles, lightTheme } from "../style.js";
import CssBaseline from "@mui/material/CssBaseline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import PersonIcon from "@mui/icons-material/Person"; // for name
import AccessibilityRoundedIcon from "@mui/icons-material/AccessibilityRounded";
import BusinessIcon from "@mui/icons-material/Business";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";
import AdminNavbar from "../navbar/AdminNavbar.jsx";

const UserProfile = () => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`http://${HOST}:${BACKEND_PORT}/api/admin/${localStorage.getItem("rfid")}`)
      .then((response) => response.json())
      .then((data) => setData(data));
    console.log(data);
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
    <RequireAuthAdmin>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <AdminNavbar />
        <Container
          component="main"
          maxWidth="lg"
          sx={{
            minHeight: "100vh",
            minWidth: "100vw",
            background: "linear-gradient(45deg,#fb1b59, #9b5afe, #5aa6fa)",
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
                  boxShadow: "0px 0px 2px 1px #d9d2e9",
                  background: "transparent",
                  backdropFilter: "blur(200px)",
                }}
                elevation={2}
                style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    margin: "0 auto",
                    marginTop: "10px",
                    marginBottom: "20px",
                  }}
                >
                  {data && (
                    <div key={data.id}>
                      <Box sx={{ display: "flex", alignItems: "start", mb: 1 }}>
                        <AccessibilityRoundedIcon sx={{ mr: 2, color: "#fff" }} />
                        <Typography variant="body2" style={{ color: "#fff" }}>
                          admin
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "start", mb: 1 }}>
                        <CreditCardRoundedIcon sx={{ mr: 2, color: "#fff" }} />
                        <Typography variant="body2" style={{ color: "#fff" }}>
                          {data.rfid}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "start", mb: 1 }}>
                        <PersonIcon sx={{ mr: 2, color: "#fff" }} />
                        <Typography variant="body2" style={{ color: "#fff" }}>
                          {data.first_name} {data.last_name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "start", mb: 1 }}>
                        <BusinessIcon sx={{ mr: 2, color: "#fff" }} />
                        <Typography variant="body2" style={{ color: "#fff" }}>
                          {data.department}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "start", mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 2, color: "#fff" }} />
                        <Typography variant="body2" style={{ color: "#fff" }}>
                          {data.site}
                        </Typography>
                      </Box>
                    </div>
                  )}
                </Box>
                <Tooltip title="logout">
                  <LogoutOutlinedIcon
                    onClick={handleLogout}
                    sx={{ color: "#fff" }}
                  />
                </Tooltip>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </RequireAuthAdmin>
  );
};

export default UserProfile;
