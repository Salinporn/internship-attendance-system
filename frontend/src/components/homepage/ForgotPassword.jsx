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
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { responsiveFontSizes } from "@mui/material/styles";

import { useStyles, darkTheme } from "../style.js";
import { toastError, toastSuccess } from "../../utils/toastNotifications.js";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";

export default function ForgotPassword() {
  const classes = useStyles();
  const navigate = useNavigate();
  const customTheme = responsiveFontSizes(darkTheme);
  const [rfid, setRfid] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = {
        rfid: rfid,
        first_name: first_name,
        last_name: last_name,
        email: email,
      };

      console.log(JSON.stringify(data));

      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/forgot-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("response: ", response);

      const responseData = await response.json();
      console.log(responseData);

      if (!response.ok) {
        console.log("Error in reset password: ", response.status);
        toastError("Error in reset password");
      } else {
        await toastSuccess("Password reset successfully");
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <React.Fragment>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Container maxWidth="xl">
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              margin: "auto",
              width: { xs: "100%", lg: "54%" },
              padding: { xs: 0, lg: 4 },
            }}
          >
            <Paper
              elevation={12}
              sx={{
                p: 4,
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <Grid item xs={12} sx={{ pb: 4 }}>
                <Typography variant="h4" gutterBottom component="h1">
                  Reset Password
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ pb: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="outlined-start-adornment"
                  placeholder="RFID"
                  onChange={(e) => setRfid(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sx={{ pb: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="outlined-start-adornment"
                  placeholder="English Name"
                  onChange={(e) => setFirst_name(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sx={{ pb: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="outlined-start-adornment"
                  placeholder="English surname (Surname)"
                  onChange={(e) => setLast_name(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sx={{ pb: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="outlined-start-adornment"
                  placeholder="Email"
                  helperText={emailError}
                  error={!!emailError}
                  onChange={(e) => {
                    const email = e.target.value;
                    if (emailPattern.test(email)) {
                      setEmail(email);
                      setEmailError("");
                    } else {
                      setEmailError("Invalid email");
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sx={{ pt: 2 }}>
                <Button
                  className={classes.uploadButton}
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Confirm
                </Button>
              </Grid>
            </Paper>
          </Box>
        </Container>
      </ThemeProvider>
      <ToastContainer />
    </React.Fragment>
  );
}

// import React, { useState } from "react";
// import {
//   Container,
//   CssBaseline,
//   Grid,
//   Paper,
//   Box,
//   Typography,
//   TextField,
//   Button,
// } from "@mui/material";
// import { ToastContainer } from "react-toastify";
// import { ThemeProvider } from "@emotion/react";
// import { useNavigate } from "react-router-dom";
// import { responsiveFontSizes } from "@mui/material/styles";
// import { useStyles, darkTheme } from "../style.js";
// import { toastError, toastSuccess } from "../../utils/toastNotifications.js";
// import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";

// const ForgotPassword = () => {
//   const classes = useStyles();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     rfid: "",
//     first_name: "",
//     last_name: "",
//     email: "",
//   });
//   const [emailError, setEmailError] = useState("");

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(
//         `http://${HOST}:${BACKEND_PORT}/forgot-password`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       const responseData = await response.json();

//       if (!response.ok) {
//         toastError("Error in reset password");
//       } else {
//         toastSuccess("Password reset successfully");
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const validateEmail = (email) => {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (emailPattern.test(email)) {
//       setEmailError("");
//     } else {
//       setEmailError("Invalid email");
//     }
//   };

//   return (
//     <React.Fragment>
//       <ThemeProvider theme={responsiveFontSizes(darkTheme)}>
//         <CssBaseline />
//         <Container maxWidth="xl">
//           <Box
//             sx={{
//               justifyContent: "center",
//               alignItems: "center",
//               minHeight: "100vh",
//               margin: "auto",
//               width: { xs: "100%", lg: "54%" },
//               padding: { xs: 0, lg: 4 },
//             }}
//           >
//             <Paper elevation={12} sx={{ p: 4, my: "20px" }}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <Typography variant="h4" gutterBottom>
//                     Reset Password
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     required
//                     fullWidth
//                     id="rfid"
//                     name="rfid"
//                     label="RFID"
//                     value={formData.rfid}
//                     onChange={handleInputChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     required
//                     fullWidth
//                     id="first_name"
//                     name="first_name"
//                     label="English Name"
//                     value={formData.first_name}
//                     onChange={handleInputChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     required
//                     fullWidth
//                     id="last_name"
//                     name="last_name"
//                     label="English Surname (Surname)"
//                     value={formData.last_name}
//                     onChange={handleInputChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     required
//                     fullWidth
//                     id="email"
//                     name="email"
//                     label="Email"
//                     value={formData.email}
//                     error={!!emailError}
//                     helperText={emailError}
//                     onChange={(e) => {
//                       setFormData({ ...formData, email: e.target.value });
//                       validateEmail(e.target.value);
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     onClick={handleSubmit}
//                   >
//                     Confirm
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Box>
//         </Container>
//       </ThemeProvider>
//       <ToastContainer />
//     </React.Fragment>
//   );
// };

// export default ForgotPassword;
