// clockin and clockout
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Button, CardActionArea, CardActions, TableBody } from "@mui/material";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import Tooltip from "@mui/material/Tooltip";

import { useStyles, darkTheme } from "../../style.js";
import { toastError, toastWarn } from "../../../utils/toastNotifications.js";
import { LoaderComponent } from "../../../utils/loader.jsx";

import { BACKEND_PORT, HOST } from "../../../utils/constants.jsx";
import { RequireAuth } from "../../../utils/requireAuth.jsx";
import TraineeNavbar from "../../navbar/TraineeNavbar.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateCiCo() {
  const classes = useStyles();
  const navigate = useNavigate();

  // UTC+7; in mongodb, it's UTC+0 by default so we need to add 7 hours
  const date = new Date();
  console.log("date: ", date);
  const options = { timeZone: "Asia/Bangkok", hour12: true };
  const dateInThailand = date.toLocaleString("en-US", options);
  const [isLoading, setIsLoading] = useState(false);

  const [openClockIn, setOpenClockIn] = React.useState(false);
  const [openClockOut, setOpenClockOut] = React.useState(false);
  const [rfid, setRfid] = React.useState(localStorage.getItem("rfid"));
  const [open, setOpen] = React.useState(false);

  const handleTooltip = () => {
    setOpen(!open);
  };

  const handleClockIn = () => {
    setOpenClockIn(true);
  };

  const handleClockOut = () => {
    setOpenClockOut(true);
  };

  const handleCloseClockIn = () => {
    setOpenClockIn(false);
  };
  const handleCloseClockOut = () => {
    setOpenClockOut(false);
  };

  const handleClockInSubmit = async (event) => {
    event.preventDefault();
    const data = {
      rfid: rfid,
      clockIn: dayjs(dateInThailand).format("YYYY-MM-DD HH:mm:ss"),
      clockOut: null,
      date: dayjs(dateInThailand).format("YYYY-MM-DD"),
    };

    console.log("Data to send: ", data);

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/clockin-clockout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        }
      );
      handleCloseClockIn();
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      const responseData = await response.json();
      console.log(responseData);

      // Display success notification
      // await toastSuccess("Successful!");
      setTimeout(() => setIsLoading(false), 3000);
      navigate("/view-clockin-clockout");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = JSON.parse(error.message);

      // Display error notification
      setIsLoading(false);
      toastError(errorMessage.error);
    }
  };

  const handleClockOutSubmit = async (event) => {
    event.preventDefault();
    const data = {
      clockOut: dayjs(dateInThailand).format("YYYY-MM-DD HH:mm:ss"),
      date: dayjs(dateInThailand).format("YYYY-MM-DD"),
    };

    console.log("Data to send: ", data);

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/clockin-clockout/${rfid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      handleCloseClockOut();
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      const responseData = await response.json();
      console.log(responseData);

      // Display success notification
      // await toastSuccess("Successful!");
      setTimeout(() => setIsLoading(false), 3000);
      navigate("/view-clockin-clockout");
    } catch (error) {
      console.error("Error:", error);

      // Display error notification
      await toastError("Failed!");
      setIsLoading(false);
    }
  };

  return (
    <RequireAuth>
      <React.Fragment>
        <ThemeProvider theme={darkTheme}>
          {isLoading ? (
            <LoaderComponent />
          ) : (
            <div>
              <CssBaseline />
              <TraineeNavbar />
              <Container
                maxWidth="lg"
                sx={{
                  background: "black.900",
                  minHeight: "100vh",
                  minWidth: "100vw",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignContent: "center",
                    }}
                  >
                    <Card
                      sx={{
                        minWidth: "345px",
                        maxWidth: "auto",
                        maxHeight: "auto",
                        borderRadius: 2,
                        background:
                          "linear-gradient(45deg, #fb1b59, #9b5afe, #5aa6fa)",
                      }}
                    >
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          image="https://plus.unsplash.com/premium_photo-1673371666402-6ca26dce6eb7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          alt="clock"
                          sx={{
                            objectFit: "cover",
                            height: 300,
                            width: "100%",
                            p: 1,
                            borderRadius: 3.5,
                          }}
                        />

                        <CardContent>
                          <Typography
                            variant="subtitle1"
                            component="h6"
                            color="#f8f8ff"
                            gutterBottom
                            style={{ margin: 0, p: 0 }}
                          >
                            Welcome to your attendance record
                            <Tooltip
                              interactive
                              open={open}
                              title={
                                <>
                                  Time in: Please keep attendance within 8.00 AM
                                  <br />
                                  Time out: Please keep attendance after 5.00 PM
                                  <br />
                                  เวลาเข้าฝึกงาน: กรุณาบันทึกเวลาเข้าฝึกงานก่อน
                                  8.00 น. <br />
                                  เวลาเลิกฝึกงาน: กรุณาบันทึกเวลาเลิกฝึกงานหลัง
                                  17.00 น.
                                </>
                              }
                            >
                              <InfoRoundedIcon
                                onClick={handleTooltip}
                                fontSize="small"
                                color="action"
                              />
                            </Tooltip>
                          </Typography>

                          <Typography
                            variant="body2"
                            color="#f8f8ff "
                            component="h1"
                            style={{ margin: 0, padding: 0 }}
                          >
                            ยินดีต้อนรับการบันทึกเวลาการฝึกงาน
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-around", mt: 5 }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleClockIn}
                        color="inherit"
                      >
                        Time In
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleClockOut}
                        color="inherit"
                      >
                        Time Out
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Container>
            </div>
          )}
        </ThemeProvider>

        <Dialog
          open={openClockOut}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseClockOut}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description-clockOut">
              <Typography
                variant="subtitle1"
                component="p"
                style={{ margin: 0, padding: 0 }}
              >
                Are you sure for your attendance recording?
              </Typography>
              <Typography variant="body2" component="p">
                คุณแน่ใจสําหรับการบันทึกเวลาฝึกงานใช่ไหม?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClockOutSubmit}>Yes</Button>
            <Button onClick={handleCloseClockOut}>Cancle</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openClockIn}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseClockIn}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description-clockIn">
              <Typography
                variant="subtitle1"
                component="p"
                style={{ margin: 0, padding: 0 }}
              >
                Are you sure for your attendance recording?
              </Typography>
              <Typography variant="body2" component="p">
                คุณแน่ใจสําหรับการบันทึกเวลาฝึกงานใช่ไหม?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClockInSubmit}>Yes</Button>
            <Button onClick={handleCloseClockIn}>Cancle</Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </React.Fragment>
    </RequireAuth>
  );
}
