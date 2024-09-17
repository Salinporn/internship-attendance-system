import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useTheme } from "@mui/material/styles";
import { Divider, Tooltip } from "@mui/material";
import Logo from "../../assets/logo.png";
import LogoBlack from "../../assets/logo-b.png";
import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

export default function PrimarySearchAppBar() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Call the backend endpoint to invalidate the token
      await fetch(`http://${HOST}:${BACKEND_PORT}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rfid: localStorage.getItem("rfid") }), // Send the RFID of the logged-in user
      });

      // Clear localStorage
      localStorage.clear();

      // Redirect to the login page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout failure if necessary
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    ></Menu>
  );

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/home" },
    {
      text: "Time Attendance record",
      icon: <AccessTimeIcon />,
      path: "/view-clockin-clockout",
    },
    {
      text: "Time Adjustment Request",
      icon: <EventNoteIcon />,
      path: "/view-time-adjustment",
    },
    { text: "Leave Request", icon: <EventBusyIcon />, path: "/view-absences" },
    { text: "Profile", icon: <AccountCircle />, path: "/profile-page" },
  ];

  const drawerContent = (
    <Box onClick={handleDrawerToggle}>
      <img
        src={LogoBlack}
        style={{
          width: "100px",
          height: "28px",
          marginLeft: 20,
          marginTop: 24,
          marginBottom: 10,
        }}
      />
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.text}>
            {item.text === "Profile" && (
              <Divider
                variant="middle"
                component="li"
                sx={{ height: "20px" }}
              />
            )}
            <ListItem
              onClick={() => navigate(item.path)}
              sx={{
                ":hover": {
                  "& .MuiListItemText-primary": {
                    color: "black",
                    fontSize: "1.1rem",
                  },
                },
              }}
            >
              <Box sx={{ mr: 2, ml: 2 }}>{item.icon}</Box>
              <ListItemText primary={item.text} />
            </ListItem>
          </React.Fragment>
        ))}
        <ListItem key="Logout" onClick={handleLogout}>
          <Box sx={{ mr: 2, ml: 2 }}><LogoutOutlinedIcon /></Box>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          style={{
            background: "linear-gradient(to right, #fb1b59, #9b5afe, #5aa6fa)",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Logo and Menu Icon for mobile screens */}
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                alignItems: "center",
              }}
            >
              <img
                src={Logo}
                style={{ width: "100px", height: "40px", marginRight: 24 }}
              />
              <IconButton color="inherit" aria-label="open drawer" edge="start">
                <MenuIcon onClick={handleDrawerToggle} />
              </IconButton>
            </Box>

            {/* Icons for PC screens */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <img
                onClick={() => navigate("/home")}
                src={Logo}
                style={{
                  width: "100px",
                  height: "40px",
                  position: "absolute",
                  left: 45,
                }}
              />

              <Tooltip title="Home">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{
                    mr: { xs: "auto", md: 10 },
                    ml: { sm: 20 },
                  }}
                  onClick={() => navigate("/home")}
                >
                  <HomeIcon
                    style={{
                      fontSize: location.pathname === "/home" ? "30px" : "24px",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Internship Time Attendance record">
                <IconButton
                  size="large"
                  edge="start"
                  sx={{ mr: { xs: "auto", md: 10 } }}
                  onClick={() => navigate("/view-clockin-clockout")}
                >
                  <AccessTimeIcon
                    style={{
                      fontSize:
                        location.pathname === "/view-clockin-clockout"
                          ? "30px"
                          : "24px",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Internship Time Adjustment Request">
                <IconButton
                  size="large"
                  edge="start"
                  sx={{ mr: { xs: "auto", md: 10 } }}
                  onClick={() => navigate("/view-time-adjustment")}
                >
                  <EventNoteIcon
                    style={{
                      fontSize:
                        location.pathname === "/view-time-adjustment"
                          ? "30px"
                          : "24px",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Internship Leave Request">
                <IconButton
                  size="large"
                  edge="start"
                  sx={{ mr: { xs: "auto", md: 10 } }}
                  onClick={() => navigate("/view-absences")}
                >
                  <EventBusyIcon
                    style={{
                      fontSize:
                        location.pathname === "/view-absences"
                          ? "30px"
                          : "24px",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  position: { xs: "static", sm: "absolute" },
                  right: { sm: 45 },
                  mr: { xs: 0 },
                }}
              >
                <Tooltip title="Profile">
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={() => navigate("/profile-page")}
                  >
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Logout">
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label="logout"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleLogout}
                  >
                    <LogoutOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Drawer component for mobile screens */}
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: "250px", // Set the width of the drawer
              background:
                "linear-gradient(to right, #fb1b59, #9b5afe, #5aa6fa)", // Set the background gradient of the drawer
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {renderMenu}
      </Box>
    </React.Fragment>
  );
}
