import { makeStyles } from "@mui/styles";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const useStyles = makeStyles({
  gradientButton: {
    background: "linear-gradient(200deg, #fb1b59, #9b5afe, #5aa6fa) !important",
    color: "#fff !important",
    "&:hover": {
      background: "linear-gradient(45deg,#fb1b59, #9b5afe, #5aa6fa) !important",
    },
  },
  loginButton: {
    borderColor: "#f5f5f5 !important",
    background: "transparent",
    color: "#f5f5f5 !important",
    "&:hover": {
      border: "none !important",
      background: "linear-gradient(90deg,#fb1b59, #9b5afe, #5aa6fa) !important",
    },
  },
  uploadButton: {
    borderColor: "#f5f5f5 !important",
    background: "#fff !important",
    color: "#000 !important",
    "&:hover": {
      color: "#fff !important",
      border: "none !important",
      background: "linear-gradient(45deg,#fb1b59, #9b5afe, #5aa6fa) !important",
    },
  },
  neonGradient: {
    border: 0,
    height: "4px",
    backgroundImage: "linear-gradient(to right, #5aa6fa, #9b5afe, #fb1b59)",
  },
  cardRoot: {
    "&:hover": {
      background: "linear-gradient(45deg,#fb1b59, #9b5afe, #5aa6fa)", //main color
    },
  },
  gradientPaper: {
    background: "linear-gradient(10deg, #ffb3c2, #c8a6f9, #a4d3ff)",
  },
  customTextField: {
    backgroundColor: "#add8e6 ",
    borderRadius: "4px 4px 0px 0px", // This will make the TextField rounded
    "& label": {
      color: "#000036",
    },
    "& label.Mui-focused": {
      color: "#000036",
    },
    "& .MuiInputBase-input": {
      color: "black",
    },
    "& .MuiFilledInput-root": {
      "&:after": {
        borderColor: "#ffd700 ",
      },
    },
  },
  trimmedText: {
    width: "195px",
    overflow: "hidden",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    textOverflow: "ellipsis",
  },
  fullText: {
    whiteSpace: "normal",
  },

  
});

export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
    },
    typography: {
      fontSize: 14,
    },
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: "h2",
            h2: "h2",
            h3: "h2",
            h4: "h2",
            h5: "h2",
            h6: "h2",
            subtitle1: "h2",
            subtitle2: "h2",
            body1: "span",
            body2: "span",
          },
        },
      },
    },
  })
);

export const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
    },
    typography: {
      fontSize: 15,
    },
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: "h2",
            h2: "h2",
            h3: "h2",
            h4: "h2",
            h5: "h2",
            h6: "h2",
            subtitle1: "h2",
            subtitle2: "h2",
            body1: "span",
            body2: "span",
          },
        },
      },
    },
  })
);
