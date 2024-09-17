// or up load trainees.csv file to the database
import * as React from "react";
import {
  Container,
  CssBaseline,
  Grid,
  Paper,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { ThemeProvider } from "@emotion/react";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import fileUploadImg from "../../assets/fileupload.png";
import { useNavigate } from "react-router-dom";

import { useStyles, lightTheme } from "../style.js";
import { toastError, toastSuccess } from "../../utils/toastNotifications.js";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";

const commonStyles = {
  borderRadius: 2.5,
  bgcolor: "#e7f0ff",
  m: 1,
  width: "100wh",
  height: "auto",
};

export default function MentorRegisteration() {
  const classes = useStyles();
  const [file, setFile] = React.useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile.name.endsWith(".csv")) {
      toastError("Please select a CSV file");
      return;
    }
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/upload-mentor-csv`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        const errMsg = data.message || "An error occurred";
        await toastError(errMsg);

        setFile(null);
        window.location.reload();
      } else {
        await toastSuccess("File uploaded successfully");
        navigate("/admin-mentors");
        setFile(null);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      await toastError("An error occurred while uploading the file");
    }
  };
  return (
    <RequireAuthAdmin>
      <React.Fragment>
        <ThemeProvider theme={lightTheme}>
          <AdminNavbar />
          <CssBaseline />
          <Container maxWidth="lg">
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
                  alignItems: "start",
                  maxWidth: { md: "60%" },
                }}
              >
                <Paper
                  elevation={12}
                  sx={{
                    padding: "20px",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Grid
                    container
                    rowSpacing={2}
                    columnSpacing={{ xs: 2, sm: 2, md: 2 }}
                  >
                    <Grid item xs={12}>
                      <Typography variant="h6" component="h1" gutterBottom>
                        Please upload new supervisor master file as CSV format
                      </Typography>
                      <hr className={classes.neonGradient} />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ ...commonStyles, borderColor: "white", p: 2 }}>
                        <Grid
                          item
                          xs={12}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <img
                            src={fileUploadImg}
                            alt="image"
                            style={{ width: "150px", height: "120px" }}
                          ></img>
                        </Grid>
                        <Grid item xs={12} sx={{ padding: 1 }}>
                          <Button
                            variant="contained"
                            component="label"
                            sx={{ borderRadius: 50 }}
                          >
                            <Typography variant="caption">Browse</Typography>
                            <input
                              type="file"
                              hidden
                              id="file-upload"
                              onChange={handleFileChange}
                            />
                          </Button>
                          {file && (
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                              Selected file: {file.name}
                            </Typography>
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            component="h6"
                            gutterBottom
                            color="error"
                          >
                            *
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            component="h6"
                            gutterBottom
                          >
                            file supported .csv
                          </Typography>
                        </Grid>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="end">
                        <Button
                          className={classes.gradientButton}
                          variant="contained"
                          endIcon={<SendRoundedIcon />}
                          onClick={handleSubmit}
                          fullWidth
                          sx={{ borderRadius: "6px", ml: 1, mr: 1 }}
                        >
                          submit
                        </Button>
                      </Stack>
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
}
