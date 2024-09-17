import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import moment from "moment";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TableSortLabel from "@mui/material/TableSortLabel";
import { ThemeProvider } from "@emotion/react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import MentorNavbar from "../navbar/MentorNavbar.jsx";
import { lightTheme } from "../style.js";
import { stableSort, getComparator } from "../../utils/sortUtils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../utils/FilterFunc";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthMentor } from "../../utils/requireAuth.jsx";

const headCells = [
  {
    id: "id",
    label: "No.",
  },
  {
    id: "rfid",
    label: "RFID",
  },
  {
    id: "fullname",
    label: "Name",
  },
  {
    id: "startDate",
    label: "Start Date",
  },
  {
    id: "endDate",
    label: "End Date",
  },

  {
    id: "leaveType",
    label: "Leave Type",
  },
  {
    id: "approved",
    label: "Status",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
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
    <TableHead style={{ backgroundColor: "#ffdef2" }}>
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

export default function ViewAbsences() {
  const navigate = useNavigate();

  const [rows, setRows] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectStartDate, setSelectStartDate] = React.useState(null);
  const [selectEndDate, setSelectEndDate] = React.useState(null);
  const [searchRfid, setSearchRfid] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const fetchAbsences = async () => {
    try {
      const response = await fetch(
        `http://${HOST}:${BACKEND_PORT}/api/get-absences-by-mentor/${localStorage.getItem(
          "rfid"
        )}`
      );
      const data = await response.json();
      setRows(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching time adjustments:", error);
    }
  };

  const handleRowClick = (rowId) => {
    navigate(`/mentor-view-absences-details/${rowId}`);
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

  const handleSearchRfidChange = (event) => {
    setSearchRfid(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  React.useEffect(() => {
    fetchAbsences();
  }, []);

  const filterRowsWithStatus = (
    rows,
    startDate,
    endDate,
    searchRfid,
    filterStatus
  ) => {
    return rows.filter((row) => {
      const isWithinDateRange =
        (!startDate || moment(row.startDate).isSameOrAfter(startDate, "day")) &&
        (!endDate || moment(row.endDate).isSameOrBefore(endDate, "day"));
      const matchesSearch =
        row.rfid.includes(searchRfid) ||
        row.trainee_fullname
          .toLowerCase()
          .includes(searchRfid.toLowerCase());
      const matchesStatus =
        !filterStatus || row.approved === filterStatus.toLowerCase();
      return isWithinDateRange && matchesSearch && matchesStatus;
    });
  };

  return (
    <RequireAuthMentor>
      <React.Fragment>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <MentorNavbar />
          <Container
            maxWidth="lg"
            sx={{
              paddingTop: "100px",
              minHeight: "100vh",
              minWidth: "99vw",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Paper elevation={2} sx={{ width: "100%", mb: 2 }}>
                <Typography
                  sx={{
                    flex: "1 1 100%",
                    paddingTop: "30px",
                  }}
                  variant="h6"
                  component="div"
                >
                  View Event: Internship Leave request
                </Typography>
                <Typography variant="subtitle1" component="div">
                  ข้อมูลการส่งคําร้องลาของนักศึกษา
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    justifyContent: { xs: "flex-between", md: "flex-end" },
                    padding: "16px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: { xs: 1, md: 0 },
                    }}>
                    <Search sx={{ marginRight: 1, height: 40 }}>
                      <SearchIconWrapper>
                        <SearchRoundedIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="RFID, Name"
                        inputProps={{ "aria-label": "search" }}
                        value={searchRfid}
                        onChange={handleSearchRfidChange}
                        sx={{ height: 40 }}
                      />
                    </Search>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: { xs: 1, md: 0 },
                    }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="From"
                        value={selectStartDate}
                        onChange={(newValue) => {
                          setSelectStartDate(newValue);
                        }}
                        slotProps={{ textField: { size: "small" } }}
                        sx={{ marginRight: 1, width: 100, height: 40 }}
                      />
                      <DatePicker
                        label="To"
                        value={selectEndDate}
                        onChange={(newValue) => {
                          setSelectEndDate(newValue);
                        }}
                        slotProps={{ textField: { size: "small" } }}
                        sx={{ marginRight: 1, width: 100, height: 40 }}
                      />
                    </LocalizationProvider>
                    <FormControl
                      sx={{
                        width: 100,
                        marginRight: 2,
                        height: 40,
                        "& .MuiInputBase-root": {
                          height: 40,
                          minHeight: 40,
                        },
                        "& .MuiInputLabel-root": {
                          lineHeight: "11.5px",
                        },
                      }}
                    >
                      <InputLabel>Status</InputLabel>
                      <Select
                        onChange={handleFilterStatusChange}
                        label="Status"
                        sx={{ height: 40 }}
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <TableContainer>
                  <Table sx={{ minWidth: 600 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                    />
                    <TableBody>
                      {Array.isArray(rows) &&
                        filterRowsWithStatus(
                          rows,
                          selectStartDate,
                          selectEndDate,
                          searchRfid,
                          filterStatus
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
                                  sx={{ maxWidth: "20px" }}
                                >
                                  {page * rowsPerPage + index + 1}
                                </TableCell>

                                <TableCell
                                  align="center"
                                  sx={{ maxWidth: "50px" }}
                                >
                                  {row.rfid}
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
                                  {row.trainee_fullname}
                                </TableCell>

                                <TableCell
                                  align="center"
                                  sx={{ maxWidth: "10px" }}
                                >
                                  {moment(row.startDate).format("MM/DD/YYYY")}
                                </TableCell>
                                <TableCell align="center">
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
                    color="secondary"
                    variant="outlined"
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
    </RequireAuthMentor>
  );
}
