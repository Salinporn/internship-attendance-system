import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Button, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "../../utils/toastNotifications.js";
import { lightTheme } from "../style.js";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";
import { useStyles } from "../style.js";
import { useNavigate } from "react-router-dom";

const LeaveRequestTypesNew = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        typeName: "",
        subtypes: [{ name: "" }],
    });
    const [hasSubtypes, setHasSubtypes] = useState(false);

    const handleChange = (event, index) => {
        const { name, value, checked, type } = event.target;
        if (type === "checkbox") {
            setHasSubtypes(checked);
        } else if (name.startsWith("subtype")) {
            const updatedSubtypes = [...formState.subtypes];
            const subtypeIndex = parseInt(name.split("-")[1]);
            updatedSubtypes[subtypeIndex].name = value;
            setFormState({ ...formState, subtypes: updatedSubtypes });
        } else {
            setFormState({ ...formState, [name]: value });
        }
    };

    const addSubtype = () => {
        setFormState({
            ...formState,
            subtypes: [...formState.subtypes, { name: "" }],
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

    const handleSubmit = async () => {
        const { typeName, subtypes } = formState;
        if (!typeName.trim()) {
            toastError("Leave Type Name cannot be empty");
            return;
        }

        if (hasSubtypes) {
            const emptySubtypes = subtypes.some(subtype => !subtype.name.trim());
            if (emptySubtypes) {
                toastError("Subtypes cannot be empty");
                return;
            }
        }

        try {
            const response = await fetch('/api/add-leavetype', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    leaveType: typeName,
                    subtypes: hasSubtypes ? subtypes.map(subtype => subtype.name).join(',') : "",
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create leave type');
            }

            const data = await response.json();
            console.log(data);
            toastSuccess("Leave type added successfully!");
            setTimeout(() => {
                navigate("/admin-leave-type");
            }, 2000);
        } catch (error) {
            console.error('Error creating leave type:', error.message);
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
                                        marginTop: "20vh",
                                        marginBottom: "20px",
                                        maxWidth: "80%"
                                    }}
                                >
                                    <Grid container rowSpacing={3} columnSpacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="h4" component="h4" gutterBottom>
                                                New Leave Request Type
                                            </Typography>
                                            <hr />
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex'}}>
                                                Leave Request Type
                                            </Typography>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={hasSubtypes}
                                                        onChange={handleChange}
                                                        name="hasSubtypes"
                                                        color="primary"
                                                    />
                                                }
                                                label="Subtypes"
                                                sx={{ marginLeft: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                name="typeName"
                                                variant="outlined"
                                                label="Type Name"
                                                value={formState.typeName}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                        </Grid>
                                        {hasSubtypes && (
                                            <Grid item xs={12}>
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    Subtypes
                                                    <IconButton
                                                        onClick={addSubtype}
                                                        sx={{ marginRight: '7px' }}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '10px',
                                                    padding: '10px',
                                                    borderRadius: '5px',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                                    minHeight: '75px'
                                                }}>
                                                    {formState.subtypes.map((subtype, index) => (
                                                        <Grid container spacing={2} alignItems="center" key={index}>
                                                            <Grid item xs={11}>
                                                                <TextField
                                                                    name={`subtype-${index}`} // Unique name for each subtype field
                                                                    variant="outlined"
                                                                    label={`Subtype ${index + 1}`}
                                                                    value={subtype.name}
                                                                    onChange={(event) => handleChange(event, index)}
                                                                    fullWidth
                                                                    sx={{ backgroundColor: 'white' }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={1}>
                                                                <IconButton
                                                                    onClick={() => removeSubtype(index)}
                                                                    sx={{ marginLeft: '-20px' }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                </Box>
                                            </Grid>
                                        )}

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
}

export default LeaveRequestTypesNew;
