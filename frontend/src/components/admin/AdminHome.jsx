import * as React from "react";
import {
  Container,
  CssBaseline,
  Box,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";

import AdminNavbar from "../navbar/AdminNavbar.jsx";
import AdminImg from "../../assets/AdminHome.jpg";

import { lightTheme } from "../style.js";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";

export default function AdminHome() {
  return (
    <RequireAuthAdmin>
      <React.Fragment>
        <ThemeProvider theme={lightTheme}>
          <AdminNavbar />
          <CssBaseline />
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              
                <img
                  src={AdminImg}
                  alt="image"
                  style={{
                    width: "100%",
                  }}
                />
              
            </Box>
          </Container>
        </ThemeProvider>
      </React.Fragment>
    </RequireAuthAdmin>
  );
}
