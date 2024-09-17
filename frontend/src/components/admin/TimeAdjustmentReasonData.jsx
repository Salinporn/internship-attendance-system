import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStyles } from "../style.js";
import { toastError, toastSuccess } from "../../utils/toastNotifications.js";
import { lightTheme } from "../style.js";
import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";
import AdminNavbar from "../navbar/AdminNavbar.jsx";

const EditTimeAdjustmentReason = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formState, setFormState] = useState({
    id: "",
    reason: "",
  });

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const fetchReason = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/reason/${id}`);
      const jsonData = await response.json();
      setFormState(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchReason();
  }, [id]);

  const handleChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = () => {
    setConfirmationDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/update-reason/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        }
      );
      const jsonData = await response.json();
      if (response.status === 400) {
        toastError(jsonData.message);
      } else {
        toastSuccess("Changes saved successfully");
        setTimeout(() => {
          navigate("/admin-adjustment-reason");
        }, 2000);
      }
    } catch (err) {
      console.error(err.message);
      toastError(err.message);
    }
    setConfirmationDialogOpen(false); // Close dialog after save
  };

  const handleCancelSave = () => {
    setConfirmationDialogOpen(false);
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
                    marginTop: "30vh",
                    marginBottom: "20px",
                    maxWidth: "70%",
                  }}
                >
                  <Grid container rowSpacing={3} columnSpacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="h4"
                        component="h4"
                        gutterBottom
                      >
                        Edit Time Adjustment Reason
                      </Typography>
                      <hr />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="reason"
                        label="Reason"
                        variant="filled"
                        value={formState.reason}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        className={classes.gradientButton}
                        onClick={handleSave}
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

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmationDialogOpen}
          onClose={handleCancelSave}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Save Changes?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to save this change?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelSave}  color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmSave} variant="contained" autoFocus>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </RequireAuthAdmin>
  );
};

export default EditTimeAdjustmentReason;
