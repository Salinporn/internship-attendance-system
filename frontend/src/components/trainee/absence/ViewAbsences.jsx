import React, { useState } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import moment from "moment";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import Hidden from "@mui/material/Hidden";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import TableSortLabel from "@mui/material/TableSortLabel";
import { ThemeProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Grid } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import { darkTheme } from "../../style.js";
import TraineeNavbar from "../../navbar/TraineeNavbar.jsx";
import { stableSort, getComparator } from "../../../utils/sortUtils";
import { filterRows } from "../../../utils/FilterFunc";

///////////////////////////////////////////////////

import { BACKEND_PORT, HOST } from "../../../utils/constants.jsx";
import { RequireAuthTrainee } from "../../../utils/requireAuth.jsx";

const headCells = [
  {
    id: "id",

    label: "No.",
  },
  {
    id: "startDate",

    label: "📆 Start Date",
  },
  {
    id: "endDate",
    label: "🗓️ End Date",
  },
  {
    id: "type",
    label: "📃 Leave Type",
  },
  {
    id: "approved",
    label: "🚩  Status",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property); // Changed from onRequestSort to handleRequestSort
  };

  const visuallyHidden = {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="center">
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

export default function ViewAbsence() {
  const rfid = localStorage.getItem("rfid");
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [searchRfid, setSearchRfid] = React.useState("");

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectStartDate, setSelectStartDate] = React.useState(null);
  const [selectEndDate, setSelectEndDate] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const fetchAbsences = async () => {
    try {
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/get-absences-byrfid/${rfid}`
      );
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error("Error fetching absences:", error);
    }
  };

  const handleRowClick = (rowId) => {
    navigate(`/absence-details/${rowId}`);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    if (Array.isArray(rows)) {
      const sortedData = stableSort(
        rows,
        getComparator(isAsc ? "desc" : "asc", property)
      );
      setRows(sortedData);
    } else {
      console.error("Rows is not an array:", rows);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    fetchAbsences();
  }, []);

  return (
    <RequireAuthTrainee>
      <div>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <TraineeNavbar />
          <Container
            maxWidth="xl"
            sx={{
              paddingTop: "80px",
              minHeight: "100vh",
              minWidth: "100vw",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Paper elevation={6} sx={{ width: "100%", mb: 2, p: 2 }}>
                <Typography
                  sx={{
                    flex: "1 1 100%",
                    color: "#66ff00",
                    paddingTop: "8px",
                  }}
                  variant="h6"
                  component="h1"
                >
                  Internship Leave Request
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="subtitle1" component="h1" align="center">
                    ระบบการลาของนักศึกษา
                  </Typography>
                  <Box>
                    <Hidden smUp>
                      <IconButton color="inherit" onClick={handleClickOpen}>
                        <FilterAltRoundedIcon />
                      </IconButton>
                    </Hidden>
                  </Box>
                </Box>
                <Hidden smDown>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    sx={{ marginRight: 6 }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="From"
                        value={selectStartDate}
                        onChange={(newValue) => {
                          setSelectStartDate(newValue);
                        }}
                        slotProps={{ textField: { size: "small" } }}
                        sx={{ marginRight: 1, width: 140 }}
                      />
                      <DatePicker
                        label="To"
                        value={selectEndDate}
                        onChange={(newValue) => {
                          setSelectEndDate(newValue);
                        }}
                        slotProps={{ textField: { size: "small" } }}
                        sx={{ marginRight: 1, width: 140 }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Hidden>

                <TableContainer>
                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Filter🔎</DialogTitle>
                    <DialogContent>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={2}>
                          <Grid item xs={6} sx={{ mt: 1 }}>
                            <DatePicker
                              label="From"
                              value={selectStartDate}
                              onChange={(newValue) => {
                                setSelectStartDate(newValue);
                              }}
                              slotProps={{ textField: { size: "small" } }}
                            />
                          </Grid>
                          <Grid item xs={6} sx={{ mt: 1 }}>
                            <DatePicker
                              label="To"
                              value={selectEndDate}
                              onChange={(newValue) => {
                                setSelectEndDate(newValue);
                              }}
                              slotProps={{ textField: { size: "small" } }}
                            />
                          </Grid>
                        </Grid>
                      </LocalizationProvider>
                    </DialogContent>
                  </Dialog>

                  <Table sx={{ minWidth: 700 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                    />
                    <TableBody>
                      {Array.isArray(rows) &&
                        filterRows(
                          rows,
                          selectStartDate,
                          selectEndDate,
                          searchRfid
                        )
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            return (
                              <TableRow
                                hover
                                onClick={() => handleRowClick(row.id)}
                                tabIndex={-1}
                                key={row.id}
                                sx={{
                                  cursor: "pointer",
                                }}
                              >
                                <TableCell
                                  align="center"
                                  component="th"
                                  scope="row"
                                  padding="none"
                                >
                                  {page * rowsPerPage + index + 1}
                                </TableCell>

                                <TableCell
                                  align="center"
                                  sx={{ minWidth: "150px" }}
                                >
                                  {moment(row.startDate).format("MM/DD/YYYY")}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ minWidth: "150px" }}
                                >
                                  {moment(row.endDate).format("MM/DD/YYYY")}
                                </TableCell>

                                <TableCell
                                  align="center"
                                  sx={{
                                    maxWidth: "50px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {row.leaveType}
                                </TableCell>
                                <TableCell align="center">
                                  {row.approved === "approved" && (
                                    <>
                                      <CheckRoundedIcon
                                        style={{ color: "#00e600" }}
                                      />
                                      {" Approved"}
                                    </>
                                  )}
                                  {row.approved === "rejected" && (
                                    <>
                                      <CloseRoundedIcon
                                        style={{ color: "#fa3a45" }}
                                      />
                                      {" Rejected"}
                                    </>
                                  )}
                                  {row.approved === "pending" && (
                                    <>
                                      <AccessTimeRoundedIcon
                                        style={{ color: "#faef3a" }}
                                      />
                                      {" Pending"}
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Stack
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ pt: 1, pb: 1 }}
                >
                  <Pagination
                    color="primary"
                    count={Math.ceil(rows.length / rowsPerPage)}
                    page={page + 1}
                    onChange={(event, value) =>
                      handleChangePage(event, value - 1)
                    }
                  />
                </Stack>
              </Paper>
            </Box>
          </Container>
        </ThemeProvider>
      </div>
    </RequireAuthTrainee>
  );
}
