import React, { useState, useEffect } from "react";
import {
  Typography,
  CssBaseline,
  ThemeProvider,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Container,
  Grid,
  Paper,
  Box,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "../../utils/toastNotifications.js";
import { lightTheme } from "../style.js";
import DeleteIcon from "@mui/icons-material/Delete";
import { IOSSwitch } from "../../utils/switch.jsx";
import AddIcon from "@mui/icons-material/Add";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";
import { useStyles } from "../style.js";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import "react-toastify/dist/ReactToastify.css";

const LeaveRequestTypeEdit = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formState, setFormState] = useState({
    leaveType: "",
    subtypes: [],
  });

  const [hasSubtypes, setHasSubtypes] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLeaveType();
    } else {
      setFormState({
        leaveType: "",
        subtypes: [],
      });
      setHasSubtypes(false);
    }
  }, [id]);

  const fetchLeaveType = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/leavetype-subtype/${id}`);
      const jsonData = await response.json();

      const subtypes = jsonData.subtypes && Array.isArray(jsonData.subtypes)
        ? jsonData.subtypes.map(subtype => ({
          name: subtype.subtype,
          existing: true,
          subtype_status: subtype.subtype_status === 1,
        }))
        : [];

      setFormState({ leaveType: jsonData.leaveType, subtypes });
      if (subtypes.length > 0 && subtypes[0].name) {
        setHasSubtypes(true);
      } else {
        setHasSubtypes(false);
        setFormState({ leaveType: jsonData.leaveType, subtypes: [] });
      }
    } catch (err) {
      console.error(err.message);
    }
  };


  const handleChange = (event, index) => {
    const { name, value, checked, type } = event.target;
    const updatedSubtypes = [...formState.subtypes];
  
    if (type === "checkbox" && name === "hasSubtypes") {
      if (formState.subtypes.length > 0 && formState.subtypes[0].name !== "") {
        // Prevent unchecking if there are existing subtypes
        return;
      }
      setHasSubtypes(checked);
      if (!checked) {
        setFormState({ ...formState, subtypes: [] });
      } else {
        if (updatedSubtypes.length === 0 && formState.subtypes.length === 0) {
          addSubtype();
        }
      }
    } else if (name.startsWith("subtype")) {
      updatedSubtypes[index].name = value;
      setFormState({ ...formState, subtypes: updatedSubtypes });
      setHasSubtypes(updatedSubtypes.length > 0);
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };
  

  const toggleSubtype = async (index) => {
    const updatedSubtypes = [...formState.subtypes];
    updatedSubtypes[index].subtype_status = !updatedSubtypes[index].subtype_status;
    setFormState({ ...formState, subtypes: updatedSubtypes });

    try {
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/update-subleavetype-status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subtype: updatedSubtypes[index] }),
        }
      );

      const jsonData = await response.json();
      if (response.status === 400) {
        console.error("Backend Error:", jsonData);
        toastError(jsonData.message);
      } else {
        toastSuccess("Subtype status updated successfully");
      }
    } catch (err) {
      console.error(err.message);
      toastError(err.message);
      updatedSubtypes[index].subtype_status = !updatedSubtypes[index].subtype_status;
      setFormState({ ...formState, subtypes: updatedSubtypes });
    }
  };

  const addSubtype = () => {
    setFormState({
      ...formState,
      subtypes: [...formState.subtypes, { name: "", existing: false, subtype_status: true }],
    });
  };

  const removeSubtype = (index) => {
    const updatedSubtypes = [...formState.subtypes];
    if (updatedSubtypes.length === 1) {
      return;
    }
    updatedSubtypes.splice(index, 1);
    setFormState({ ...formState, subtypes: updatedSubtypes });
  };

  const openSaveConfirmationDialog = () => {
    setOpenDialog(true);
  };

  const closeSaveConfirmationDialog = () => {
    setOpenDialog(false);
  };

  const handleCancelSave = () => {
    closeSaveConfirmationDialog();
  };

  const handleConfirmSave = async () => {
    closeSaveConfirmationDialog();

    // Validate leaveType
    if (!formState.leaveType || !formState.leaveType.trim()) {
      toastError("Leave Request Type is required.");
      return;
    }

    // Validate subtypes if hasSubtypes is true
    if (hasSubtypes) {
      for (let i = 0; i < formState.subtypes.length; i++) {
        const subtypeName = formState.subtypes[i]?.name;
        if (!subtypeName || !subtypeName.trim()) {
          toastError(`Subtype ${i + 1} is empty.`);
          return;
        }
      }
    }

    // Map subtypes into the expected format, including subtype_status
    const updatedSubtypes = formState.subtypes.map((subtype) => ({
      name: subtype.name,
      subtype_status: subtype.subtype_status ? 1 : 0,
    }));

    // Construct the updatedFormState with leaveType, type_status, and subtypes
    const updatedFormState = {
      leaveType: formState.leaveType,
      type_status: 1,
      subtypes: updatedSubtypes,
    };

    try {
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/update-leavetype-subtype/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormState),
        }
      );

      const jsonData = await response.json();
      if (response.status === 400) {
        console.error("Backend Error:", jsonData);
        toastError(jsonData.error);
      } else {
        toastSuccess("Changes saved successfully");
        setTimeout(() => {
          navigate("/admin-leave-type");
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
        <CssBaseline />
        <ThemeProvider theme={lightTheme}>
          <AdminNavbar />
          <Container maxWidth="xl">
            <Grid container direction="column" justifyContent="start" alignItems="center" style={{ minHeight: "100vh" }}>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", maxWidth: { md: "60%" } }}>
                <Paper elevation={12} sx={{ bgcolor: "black.900", padding: "20px", marginTop: "20vh", marginBottom: "20px", maxWidth: "80%" }}>
                  <Grid container rowSpacing={3} columnSpacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h4" component="h4" gutterBottom>
                        Edit Leave Request Type
                      </Typography>
                      <hr />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        Leave Request Type
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={hasSubtypes}
                            onChange={handleChange}
                            name="hasSubtypes"
                            color="primary"
                            disabled={formState.subtypes.length > 0 && formState.subtypes[0].name !== ""}
                          />
                        }
                        label="Subtypes"
                        sx={{ marginLeft: 2 }}
                      />

                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="leaveType"
                        variant="outlined"
                        label="Type Name"
                        value={formState.leaveType}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    {hasSubtypes && (
                      <Grid item xs={12}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          Subtypes
                          <IconButton onClick={addSubtype} sx={{ marginRight: '7px' }}>
                            <AddIcon />
                          </IconButton>
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px', borderRadius: '5px', backgroundColor: 'rgba(0, 0, 0, 0.05)', minHeight: '75px' }}>
                          {formState.subtypes.map((subtype, index) => (
                            <Grid container spacing={2} alignItems="center" key={index} sx={{ marginRight: '10px', marginLeft: { md: '5px' }}}>
                              <Grid item xs={10}>
                                <TextField
                                  name={`subtype-${index}`}
                                  variant="outlined"
                                  label={`Subtype ${index + 1}`}
                                  value={subtype.name}
                                  onChange={(event) => handleChange(event, index)}
                                  fullWidth
                                  sx={{ backgroundColor: 'white' }}
                                />
                              </Grid>
                              {!subtype.existing && (
                                < Grid item xs={1.5} marginLeft={-1}>
                                  <Tooltip title="Delete Subtype">
                                    <IconButton onClick={() => removeSubtype(index)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Grid>
                              )}
                              {subtype.existing && (
                                < Grid item xs={1}>
                                  <Tooltip marginLeft={4} title="Active / Inactive">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '10px' }}>
                                      <IOSSwitch
                                        checked={subtype.subtype_status}
                                        onChange={() => toggleSubtype(index)}
                                      />
                                    </Box>
                                  </Tooltip>
                                </Grid>
                              )}
                            </Grid>
                          ))}
                        </Box>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Button
                        className={classes.gradientButton}
                        variant="contained"
                        onClick={openSaveConfirmationDialog}
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Container >
        </ThemeProvider >
        <ToastContainer />
        <Dialog
          open={openDialog}
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
            <Button onClick={handleCancelSave} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmSave} variant="contained" autoFocus>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment >
    </RequireAuthAdmin >
  );
};

export default LeaveRequestTypeEdit;
