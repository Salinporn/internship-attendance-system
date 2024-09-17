import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Card, Typography } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { useMediaQuery, useTheme } from "@mui/material";

import TraineeNavbar from "../navbar/TraineeNavbar.jsx";
import cicoImg from "../../assets/cico.png";
import timeAdImg from "../../assets/timeadjustment.png";
import absenceImg from "../../assets/absence.png";
import { useStyles, darkTheme } from "../style.js";

import { RequireAuth } from "../../utils/requireAuth.jsx";

const Home = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <RequireAuth>
      <React.Fragment>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <TraineeNavbar />
          <Container
            maxWidth="xl"
          
          >
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                sx={{
                  maxWidth: { md: "50%" },
                }}
              >
                <Grid container columnSpacing={{ xs: 2 }}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="start"
                    sx={{ marginLeft: "15px" }}
                  >
                    <Grid
                      item
                      xs={12}
                      sx={{ margin: "10px", marginTop: "100px" }}
                    >
                      <Link
                        to="/clockin-clockout"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Card elevation={6} className={classes.cardRoot}>
                          <CardHeader
                            title={
                              <Typography
                                variant="h6"
                                component="div"
                                align="left"
                                sx={{ mt: 1 }}
                              >
                                Internship Attendance Record
                              </Typography>
                            }
                            subheader={
                              <Typography
                                variant="subtitle2"
                                component="div"
                                align="left"
                                gutterBottom
                              >
                                บันทึกเวลาการฝึกงาน
                              </Typography>
                            }
                            titleTypographyProps={{ variant: "h6" }}
                            subheaderTypographyProps={{ variant: "subtitle2" }}
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                          />
                          <Divider />
                          <CardContent
                            style={{ paddingTop: 0, paddingBottom: 0 }}
                          >
                            <Grid container alignItems="center">
                              <Grid item xs={4} style={{ padding: 0, margin: 0 }}>
                                <img
                                  src={cicoImg}
                                  alt="check-in/out image"
                                  style={{ padding: 0, margin: 0 }}
                                />
                              </Grid>
                              <Grid item xs={8}>
                                <Box pl={2}>
                                  <Typography
                                    className={
                                      isMobile
                                        ? classes.trimmedText
                                        : classes.fullText
                                    }
                                    variant="subtitle2"
                                    component="h1"
                                    align="start"
                                    gutterBottom
                                  >
                                    Keep a record of your own attendance !!! Do
                                    not make time recording or signing name on
                                    behalf of each other or do not act against the
                                    company rule regulation, it is prohibited
                                  </Typography>
                                  <Typography
                                    className={
                                      isMobile
                                        ? classes.trimmedText
                                        : classes.fullText
                                    }
                                    variant="subtitle2"
                                    component="h1"
                                    align="start"
                                    gutterBottom
                                  >
                                    นักศึกษาจะต้องทำการบันทึกเวลาการฝึกงานด้วยตนเอง
                                    การบันทึกเวลาฝึกงานแทนกัน ถือว่าเจตนาทุจริต
                                    มีความผิดร้ายแรง
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Link>
                    </Grid>

                    <Grid item xs={12} sx={{ margin: "10px", marginTop: "10px" }}>
                      <Link
                        to="/time-adjustment"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Card elevation={6} className={classes.cardRoot}>
                          <CardHeader
                            title={
                              <Typography
                                variant="h6"
                                component="div"
                                align="left"
                                sx={{ mt: 1 }}
                              >
                                Internship Time Adjustment Request
                              </Typography>
                            }
                            subheader={
                              <Typography
                                variant="subtitle2"
                                component="div"
                                align="left"
                                gutterBottom
                              >
                                ระบบการบันทึกเวลาฝึกงานของนักศึกษา
                              </Typography>
                            }
                            titleTypographyProps={{ variant: "h6" }}
                            subheaderTypographyProps={{ variant: "subtitle2" }}
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                          />
                          <Divider variant="middle" />
                          <CardContent
                            style={{ paddingTop: 0, paddingBottom: 0 }}
                          >
                            <Grid container alignItems="center">
                              <Grid item xs={4} style={{ padding: 0, margin: 0 }}>
                                <img
                                  src={timeAdImg}
                                  alt="check-in/out image"
                                  style={{ padding: 0, margin: 0 }}
                                />
                              </Grid>
                              <Grid item xs={8}>
                                <Box pl={2}>
                                  <Typography
                                    className={
                                      isMobile
                                        ? classes.trimmedText
                                        : classes.fullText
                                    }
                                    variant="subtitle2"
                                    component="h1"
                                    align="start"
                                    gutterBottom
                                  >
                                    Time Adjustment Request for Internship
                                    Student. *If student forgot badge/lost badge
                                    please borrow temporary badge at Security Room
                                  </Typography>
                                  <Typography
                                    className={
                                      isMobile
                                        ? classes.trimmedText
                                        : classes.fullText
                                    }
                                    variant="subtitle2"
                                    component="h1"
                                    align="start"
                                    gutterBottom
                                  >
                                  แบบคำร้องขอบันทึกเวลาฝึกงาน สำหรับนักศึกษาฝึกงาน  *กรณีลืมบัตร/บัตรหาย กรุณายืมบัตรชั่วคราวที่แผนกรักษาความปลอดภัย
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Link>
                    </Grid>

                    <Grid item xs={12} sx={{ margin: "10px", marginTop: "10px" }}>
                      <Link
                        to="/leave-request"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Card elevation={6} className={classes.cardRoot}>
                          <CardHeader
                            title={
                              <Typography
                                variant="h6"
                                component="div"
                                align="left"
                                sx={{ mt: 1 }}
                              >
                                Internship Leave Request
                              </Typography>
                            }
                            subheader={
                              <Typography
                                variant="subtitle2"
                                component="div"
                                align="left"
                                gutterBottom
                              >
                                ระบบการลาของนักศึกษา
                              </Typography>
                            }
                            titleTypographyProps={{ variant: "h6" }}
                            subheaderTypographyProps={{ variant: "subtitle2" }}
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                          />
                          <Divider />
                          <CardContent
                            style={{ paddingTop: 0, paddingBottom: 0 }}
                          >
                            <Grid container alignItems="center">
                              <Grid item xs={4} style={{ padding: 0, margin: 0 }}>
                                <img
                                  src={absenceImg}
                                  alt="check-in/out image"
                                  style={{ padding: 0, margin: 0 }}
                                />
                              </Grid>
                              <Grid item xs={8}>
                                <Box pl={2}>
                                  <Typography
                                    className={
                                      isMobile
                                        ? classes.trimmedText
                                        : classes.fullText
                                    }
                                    variant="subtitle2"
                                    component="h1"
                                    align="start"
                                    gutterBottom
                                  >
                                    Leave Request for Internship
                                    Student.*Personal/Business Leave please inform
                                    at least 3 days prior
                                  </Typography>
                                  <Typography
                                    className={
                                      isMobile
                                        ? classes.trimmedText
                                        : classes.fullText
                                    }
                                    variant="subtitle2"
                                    component="h1"
                                    align="start"
                                    gutterBottom
                                  >
                                ใบลา สำหรับนักศึกษาฝึกงาน *กรณีลากิจจะต้องแจ้งล่วงหน้าอย่างน้อย 3 วัน
                                  </Typography>
                                
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Link>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Container>
        </ThemeProvider>
      </React.Fragment>
    </RequireAuth>
  );
};

export default Home;
