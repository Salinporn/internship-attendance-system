import React from "react";
import { useNavigate } from "react-router-dom";
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
import Hidden from "@mui/material/Hidden";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import TableSortLabel from "@mui/material/TableSortLabel";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import { darkTheme } from "../../style.js";
import TraineeNavbar from "../../navbar/TraineeNavbar.jsx";
import { ThemeProvider } from "@emotion/react";
import { stableSort, getComparator } from "../../../utils/sortUtils";
import { MonthSelect, YearSelect } from "../../../utils/FilterFunc";

import { BACKEND_PORT, HOST } from "../../../utils/constants.jsx";
import { RequireAuth } from "../../../utils/requireAuth.jsx";

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "No.",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "📅 Date",
  },
  {
    id: "clockIn",
    numeric: false,
    disablePadding: false,
    label: "⏰ Time In",
  },
  {
    id: "clockOut",
    numeric: false,
    disablePadding: false,
    label: "🚗 Time Out",
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
export default function ViewCicos() {
  const navigate = useNavigate();
  const rfid = localStorage.getItem("rfid");
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear()
  );

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchCicos = async () => {
    try {
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/clockin-clockouts/${rfid}`
      );
      const data = await response.json();
      setRows(data);
      console.log("data: ", data);
    } catch (error) {
      console.log(error);
    }
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    fetchCicos();
  }, []);

  return (
    <RequireAuth>
      <React.Fragment>
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
                    color: "#fcc200",
                    paddingTop: "8px",
                  }}
                  variant="h6"
                  component="h6"
                >
                  Internship Time Attendance Record
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="subtitle1" component="h1" align="center">
                    การบันทึกเวลาการฝึกงานนักศึกษา
                  </Typography>
                  <Box>
                    <Hidden smUp>
                      <IconButton color="inherit" onClick={handleClickOpen}>
                        <FilterAltRoundedIcon />
                      </IconButton>
                    </Hidden>
                  </Box>
                </Box>
                <TableContainer>
                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Filter🔎</DialogTitle>
                    <DialogContent>
                      <MonthSelect
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                      />

                      <YearSelect
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                      />
                    </DialogContent>
                  </Dialog>

                  <Hidden smDown>
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      sx={{ marginRight: 6 }}
                    >
                      <MonthSelect
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                      />

                      <YearSelect
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                      />
                    </Box>
                  </Hidden>

                  <Table sx={{ minWidth: 500 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                    />
                    <TableBody>
                      {Array.isArray(rows) &&
                        rows
                          .filter((row) => {
                            const date = new Date(row.date);
                            return (
                              date.getMonth() === selectedMonth &&
                              date.getFullYear() === selectedYear
                            );
                          })
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            return (
                              <TableRow
                                hover
                              
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
                                <TableCell align="center">
                                  {moment(row.date).format("MM/DD/YYYY")}
                                </TableCell>
                                <TableCell align="center">
                                  {row.clockIn === null
                                    ? "😢"
                                    : moment(row.clockIn).format("h:mm:ss A")}
                                </TableCell>
                                <TableCell align="center">
                                  {row.clockOut === null
                                    ? "😊"
                                    : moment(row.clockOut).format("h:mm:ss A")}
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
      </React.Fragment>
    </RequireAuth>
  );
}
