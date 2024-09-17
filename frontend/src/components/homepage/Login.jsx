import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import {
  Card,
  Typography,
  Box,
  Grid,
  Link,
  IconButton,
  Stack,
} from "@mui/material";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";

import InputAdornment from "@mui/material/InputAdornment";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { useStyles, darkTheme } from "../style.js";
import login from "../../assets/logo.png";

import { toastError, toastSuccess } from "../../utils/toastNotifications.js";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";

export default function Login() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { rfid, pwd } = inputs;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const onChange = (e) => {
    const { name, value } = e.target;

    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rfid, pwd }),
      });

      if (!response.ok) {
        const data = await response.json();
        toastError(data.message);
        return;
      }

      const data = await response.json();
      console.log(data); // Log the response data

      if (data && data.success) {
        localStorage.setItem("rfid", rfid);
        localStorage.setItem("token", data.token);
        toastSuccess(data.message);
        setTimeout(() => {
          if (data.passwordUpdates === 0) {
            navigate("/change-password");
          } else {
            localStorage.setItem("role", data.role);
            if (data.role === "trainee") {
              navigate("/home");
            } else if (data.role === "admin") {
              navigate("/admin-home");
            } else if (data.role === "mentor") {
              navigate("/mentor-view-time-adjustments");
            } else {
              // Handle unknown role
              toastError("Unknown role");
            }
          }
        }, 750);
      }
    } catch (error) {
      console.log(error);
      toastError("Server Connection Failed");
    }
    setInputs({
      rfid: "",
      pwd: "",
    });
  };
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Container
          component="main"
          maxWidth="lg"
          sx={{
            minHeight: "100vh",
            minWidth: "100vw",
            background: "linear-gradient(45deg,#fb1b59, #9b5afe, #5aa6fa)",
          }}
        >
          <CssBaseline />
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
                maxWidth: { md: "50%" },
              }}
            >
              <Grid container columnSpacing={{ xs: 2, sm: 2, md: 1 }}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="start"
                  sx={{ marginLeft: "15px" }}
                >
                  <Card
                    sx={{
                      background: "#1b1b1b",
                      width: "100%",
                      height: "100%",
                      borderRadius: "12px",
                      boxShadow: "0px 0px 12px 2px #353839",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          p: 3,
                        }}
                      >
                        <img
                          src={login}
                          style={{ width: "150px", height: "60px" }}
                        />
                        

                        <Box
                          component="form"
                          onSubmit={handleSubmit}
                          noValidate
                          sx={{ mt: 1 }}
                        >
                          <Grid
                            item
                            xs={12}
                            sx={{ alignItems: "center" }}
                            container
                            direction="column"
                          >
                            <TextField
                              type="text"
                              name="rfid"
                              value={rfid}
                              onChange={onChange}
                              id="outlined-start-adornment"
                              sx={{
                                m: 1,
                                width: "100%",
                                mx: "auto",
                                pt: 2,
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "50px",
                                },
                              }}
                              placeholder="RFID"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    sx={{ mr: 2 }}
                                  >
                                    <PersonIcon />
                                  </InputAdornment>
                                ),
                              }}
                              inputProps={{ style: { fontSize: 15 } }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sx={{ alignItems: "center" }}
                            container
                            direction="column"
                          >
                            <TextField
                              id="outlined-start-adornment"
                              sx={{
                                mt: 1,
                                mr: 1,
                                ml: 1,
                                width: "100%",
                                mx: "auto",
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "50px",
                                },
                              }}
                              placeholder="PASSWORD"
                              type={showPassword ? "text" : "password"}
                              name="pwd"
                              value={pwd}
                              onChange={onChange}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    sx={{ mr: 2 }}
                                  >
                                    <KeyIcon />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle-pwd-visibility"
                                      onClick={handleTogglePassword}
                                    >
                                      {showPassword ? (
                                        <VisibilityOffRoundedIcon />
                                      ) : (
                                        <VisibilityRoundedIcon />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              inputProps={{ style: { fontSize: 15 } }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              alignItems: "center",
                              marginTop: "10px",
                              marginBottom: "5px",
                            }}
                            container
                            direction="column"
                          >
                            <Button
                              sx={{mt: 4, p: 1, mb: 2,
                                width: "100%", mx: "auto", borderRadius: "50px" }}
                              type="submit"
                              variant="outlined"
                              className={classes.loginButton}
                              onClick={handleSubmit}
                              fullWidth
                            >
                              <Typography variant="body2" component="h1">
                                Log In
                              </Typography>
                            </Button>
                            <Stack alignItems="flex-end" width="100%">
                              <Link href="/forgot-password" variant="caption">
                                Forgot Password?
                              </Link>
                            </Stack>
                          </Grid>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Container>
      </ThemeProvider>
      <ToastContainer />
    </div>
  );
}
