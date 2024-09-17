import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import { ToastContainer, toast } from "react-toastify";
import { ThemeProvider } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { Tooltip, ClickAwayListener } from "@mui/material";
import { responsiveFontSizes } from "@mui/material/styles";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { useStyles, darkTheme } from "../style.js";
import { toastError, toastSuccess } from "../../utils/toastNotifications.js";
import validatePassword from "../../utils/ValidatationPwd.js";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuth } from "../../utils/requireAuth.jsx";

export default function ChangePassword() {
  const classes = useStyles();
  const navigate = useNavigate();
  const customTheme = responsiveFontSizes(darkTheme);
  const rfid = localStorage.getItem("rfid");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  const handleCurrentPwd = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const handleNewPwd = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleConfirmPwd = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (confirmNewPassword !== newPassword) {
      toastError("password does't match");
      return;
    }

    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rfid: rfid,
          old_pwd: currentPassword,
          new_pwd: newPassword,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        console.log("Error in changing password: ", response.status);
        toastError("Error in changing password");
      } else {
        await toastSuccess("Password changed successfully");

        // Navigate based on role
        if (data.role === "trainee") {
          navigate("/home");
        } else if (data.role === "admin") {
          navigate("/admin-home");
        } else if (data.role === "mentor") {
          navigate("/mentor-view-time-adjustments");
        }
      }

      // Handle the response data...
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <RequireAuth>
      <React.Fragment>
        <ThemeProvider theme={customTheme}>
          <CssBaseline />
          <Container maxWidth="lg">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="start"
              style={{ minHeight: "100vh" }}
            >
              <Box
                sx={{
                  // display: "flex",
                  justifyContent: "center",
                  alignItems: "start",
                  minWidth: "70%",
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    marginTop: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <Grid item xs={12} sx={{ pb: 2 }}>
                    <Typography variant="h4" gutterBottom component="h1">
                      Change Password
                      <ClickAwayListener
                        onClickAway={() => setShowInstructions(false)}
                      >
                        <Tooltip
                          PopperProps={{
                            disablePortal: true,
                          }}
                          onClose={() => setShowInstructions(false)}
                          open={showInstructions}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          title={
                            <React.Fragment>
                              {"At least 8 characters long"} <br />
                              {"Contains at least one uppercase letter"} <br />
                              {"Contains at least one lowercase letter"} <br />
                              {"Contains at least one number"}
                            </React.Fragment>
                          }
                        >
                          <IconButton
                            aria-label="password-instructions"
                            onClick={(event) => {
                              event.preventDefault();
                              setShowInstructions(!showInstructions);
                            }}
                          >
                            <LightbulbOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </ClickAwayListener>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 2 }}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-start-adornment"
                      placeholder="Current Password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle-pwd-visibility"
                              onClick={handleCurrentPwd}
                            >
                              {showCurrentPassword ? (
                                <VisibilityOffRoundedIcon />
                              ) : (
                                <VisibilityRoundedIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 2 }}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-start-adornment"
                      placeholder="New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => {
                        const password = event.target.value;
                        setNewPassword(password);

                        if (!validatePassword(password)) {
                          // Set the error message if the password is invalid
                          setErrorMessage("Invalid password");
                        } else {
                          // Clear the error message if the password is valid
                          setErrorMessage("");
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle-pwd-visibility"
                              onClick={handleNewPwd}
                            >
                              {showNewPassword ? (
                                <VisibilityOffRoundedIcon />
                              ) : (
                                <VisibilityRoundedIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      error={!!errorMessage}
                      helperText={errorMessage}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 2 }}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-start-adornment"
                      placeholder="Confirm New Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(event) => {
                        const c_password = event.target.value;
                        setConfirmNewPassword(c_password);

                        if (!validatePassword(c_password)) {
                          setConfirmErrorMessage("Invalid password");
                        } else {
                          setConfirmErrorMessage("");
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle-pwd-visibility"
                              onClick={handleConfirmPwd}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOffRoundedIcon />
                              ) : (
                                <VisibilityRoundedIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      error={!!confirmErrorMessage}
                      helperText={confirmErrorMessage}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ pt: 2 }}>
                    <Button
                      className={classes.uploadButton}
                      variant="contained"
                      fullWidth
                      onClick={handleSubmit}
                    >
                      confirm
                    </Button>
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Container>
        </ThemeProvider>
        <ToastContainer />
      </React.Fragment>
    </RequireAuth>
  );
}
