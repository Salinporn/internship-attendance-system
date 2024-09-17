import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import { Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/ListItemButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Logo from "../../assets/logo.png";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";

export default function AdminNavbar() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElSub, setAnchorElSub] = React.useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const isMenuOpen = Boolean(anchorEl);
  
  // Create a ref for the "More options" menu button
  const moreOptionsRef = React.useRef(null);

  const handleSubMenuOpen = (event) => {
    setAnchorElSub(event.currentTarget);
  };

  const handleSubMenuClose = () => {
    setAnchorElSub(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
    if (location.pathname === path) {
      setIsDrawerOpen(false);
    }
  };

  const handleDrawerToggle = (event) => {
    if (isDrawerOpen == false) {
      setIsDrawerOpen(true);
    } else {
      if (event.target === moreOptionsRef.current) {
        setIsDrawerOpen(true);
      }
    }
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

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/admin-home" },
    { text: "Attendance Record", icon: <AccessTimeIcon />, path: "/admin-view-cico" },
    { text: "Time Adjustment", icon: <EventNoteIcon />, path: "/admin-view-time-adjustment" },
    { text: "Leave Request", icon: <EventBusyIcon />, path: "/admin-view-absences" },
  ];

  const drawerContent = (
    <Box onClick={handleDrawerToggle}>
      <img
        src={Logo}
        style={{ width: "100px", height: "40px", margin: "24px 20px 10px" }}
      />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} onClick={() => handleMenuItemClick(item.path)}>
            <Box sx={{ mr: 2, ml: 2 }}>{item.icon}</Box>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem onClick={handleMenuOpen}>
          <Box sx={{ mr: 2, ml: 2 }}><MoreVertIcon /></Box>
          <ListItemText primary="More options" />
        </ListItem>
        <ListItem sx={{ borderBottom: 1.5, borderColor: "black", opacity: 0.5, marginBottom: 2, width: "90%", marginLeft: 2 }} />

        <ListItem key="Profile" onClick={() => handleMenuItemClick("/admin-profile-page")}>
            <Box sx={{ mr: 2, ml: 2 }}>{<AccountCircle />}</Box>
            <ListItemText primary="Profile" />
        </ListItem>
        <ListItem key="Logout" onClick={handleLogout}>
            <Box sx={{ mr: 2, ml: 2 }}><LogoutOutlinedIcon /></Box>
            <ListItemText primary="Logout" />
          </ListItem>
      </List>
    </Box>
  );

  const renderMenu = (
    <Popover
      id={menuId}
      open={isMenuOpen}
      anchorEl={anchorEl}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Paper onMouseLeave={handleMenuClose} sx={{ backgroundColor: "transparent" }}>
        <ListItemButton onClick={handleSubMenuOpen}>Upload File</ListItemButton>
        <Popover
          open={Boolean(anchorElSub)}
          anchorEl={anchorElSub}
          onClose={handleSubMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Paper onMouseLeave={handleMenuClose} sx={{ backgroundColor: "transparent" }}>
            <ListItemButton onClick={() => handleMenuItemClick("/upload-user-csv")}>
              New Internship Upload
            </ListItemButton>
            <ListItemButton onClick={() => handleMenuItemClick("/upload-mentor-csv")}>
              New Mentor Upload
            </ListItemButton>
          </Paper>
        </Popover>
        <ListItemButton onClick={() => handleMenuItemClick("/admin-mentors")}>
          Supervisor / Mentor
        </ListItemButton>
        <ListItemButton onClick={() => handleMenuItemClick("/admin-trainees")}>
          Internship Student
        </ListItemButton>
        <ListItemButton onClick={() => handleMenuItemClick("/admin-leave-type")}>
          Leave Request Type
        </ListItemButton>
        <ListItemButton onClick={() => handleMenuItemClick("/admin-adjustment-reason")}>
          Time Adjustment Reason
        </ListItemButton>
      </Paper>
    </Popover>
  );

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          style={{ background: "linear-gradient(to right, #fb1b59, #9b5afe, #5aa6fa)" }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
              <img src={Logo} style={{ width: "100px", height: "40px", marginRight: 24 }} />
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
              <img
                onClick={() => navigate("/admin-home")}
                src={Logo}
                style={{ width: "100px", height: "40px", position: "absolute", left: 45 }}
              />
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
              <Button
                ref={moreOptionsRef} // Attach ref here
                size="small"
                edge="start"
                sx={{ color: "inherit", margin: "16px" }}
                onClick={handleMenuOpen}
              >
                More options
              </Button>
              <Button
                size="small"
                edge="start"
                sx={{ color: location.pathname === "/admin-view-time-adjustment" ? "black" : "inherit", margin: "12px" }}
                onClick={() => navigate("/admin-view-time-adjustment")}
              >
                Time Adjustment
              </Button>
              <Button
                size="small"
                edge="start"
                sx={{ color: location.pathname === "/admin-view-absences" ? "black" : "inherit", margin: "12px" }}
                onClick={() => navigate("/admin-view-absences")}
              >
                Leave Request
              </Button>
              <Button
                size="small"
                edge="start"
                sx={{ color: location.pathname === "/admin-view-cico" ? "black" : "inherit", margin: "12px" }}
                onClick={() => navigate("/admin-view-cico")}
              >
                Attendance Record
              </Button>
              <Tooltip title="Profile">
                <IconButton
                  size="large"
                  color="inherit"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={() => navigate("/admin-profile-page")}
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
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: "250px", background: "linear-gradient(to right, #fb1b59, #9b5afe, #5aa6fa)" } }}
        >
          {drawerContent}
        </Drawer>
        {renderMenu}
      </Box>
    </React.Fragment>
  );
}
