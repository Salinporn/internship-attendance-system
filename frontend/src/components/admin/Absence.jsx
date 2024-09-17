import React from "react";
import { useNavigate } from "react-router-dom";
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
import TableSortLabel from "@mui/material/TableSortLabel";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Papa from "papaparse";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Tooltip } from "@mui/material";

import icon from "../../assets/csv.png";
import { lightTheme } from "../style.js";
import { ThemeProvider } from "@emotion/react";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import { stableSort, getComparator } from "../../utils/sortUtils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  filterRows,
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../utils/FilterFunc";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";

import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
    id: "trainee_fullname",
    label: "Name",
  },
  {
    id: "cloud_site",
    label: "Site",
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
    id: "reason",
    label: "Reason",
  },
  {
    id: "period",
    label: "Period Of Time",
  },
  {
    id: "mentorRemark",
    label: "Mentor Remark",
  },
  {
    id: "mentor_fullname",
    label: "Mentor Name",
  },
  {
    id: "approvalDate",
    label: "Approval Date",
  },
  {
    id: "approved",
    label: "Status",
  },
  {
    id: "date",
    label: "Created Date",
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

export default function AdminAbsences() {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [searchRfid, setSearchRfid] = React.useState("");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);
  const [selectStartDate, setSelectStartDate] = React.useState(null);
  const [selectEndDate, setSelectEndDate] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedSite, setSelectedSite] = React.useState(""); // State for selected site

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const exportToCsv = () => {
    let filteredRows = rows;
    if (selectedSite) {
      // Filter rows by selected site
      filteredRows = rows.filter((row) => row.cloud_site === selectedSite);
      filteredRows = filteredRows.map((row) => {
        const { filepath, type, subType, ...rest } = row;
        return rest;
      });
    }
    filteredRows = filterRows(filteredRows, selectStartDate, selectEndDate, searchRfid);
    const csv = Papa.unparse(filteredRows);
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const csvURL = window.URL.createObjectURL(csvData);
    let tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "export.csv");
    tempLink.click();
  };

  const handleSearchRfidChange = (event) => {
    setSearchRfid(event.target.value);
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

  const handleRowClick = async (rowId) => {
    navigate(`/admin-view-absences-details/${rowId}`);
  };

  const fetchAbsence = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/get-all-absences`);
      const data = await response.json();
      setRows(data);
      console.log(data);
    } catch (error) {
      console.log("Error fetching time adjustments: ", error);
    }
  };

  React.useEffect(() => {
    fetchAbsence();
  }, []);

  return (
    <RequireAuthAdmin>
      <React.Fragment>
        <ThemeProvider theme={lightTheme}>
          <AdminNavbar />
          <CssBaseline />
          <Container
            maxWidth="lg"
            sx={{
              paddingTop: "100px",
              minHeight: "100vh",
              minWidth: "100vw",
            }}
          >
            <Paper elevation={6} sx={{ width: "100%", mb: 2 }}>
              <Typography
                sx={{
                  flex: "1 1 100%",
                  paddingTop: "16px",
                  paddingBottom: "6px",
                }}
                variant="h5"
                id="tableTitle"
                component="div"
              >
                View Event: Internship Leave request
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
                  <Search sx={{ marginRight: 1 }}>
                    <SearchIconWrapper>
                      <SearchRoundedIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="RFID, Name"
                      inputProps={{ "aria-label": "search" }}
                      value={searchRfid}
                      onChange={handleSearchRfidChange}
                    />
                  </Search>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="From"
                      value={selectStartDate}
                      onChange={(newValue) => {
                        setSelectStartDate(newValue);
                      }}
                      slotProps={{ textField: { size: "small" } }}
                      sx={{ marginRight: 1, width: 100, minWidth: 60 }}
                    />
                    <DatePicker
                      label="To"
                      value={selectEndDate}
                      onChange={(newValue) => {
                        setSelectEndDate(newValue);
                      }}
                      slotProps={{ textField: { size: "small" } }}
                      sx={{ marginRight: 1, width: 100, minWidth: 60 }}
                    />
                  </LocalizationProvider>
                  <FormControl sx={{ minWidth: 100, marginRight: 1 }} size="small">
                    <InputLabel id="site-select-label">Site</InputLabel>
                    <Select
                      labelId="site-select-label"
                      id="site-select"
                      value={selectedSite}
                      label="Site"
                      onChange={(e) => setSelectedSite(e.target.value)}
                      sx={{ height: 40, width: 100 }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {[...new Set(rows.map((row) => row.cloud_site))].map((site) => (
                        <MenuItem key={site} value={site}>
                          {site}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Tooltip title="export file">
                    <img
                      src={icon}
                      width={42}
                      height={42}
                      onClick={exportToCsv}
                      style={{
                        filter: "drop-shadow(3px 3px 1px rgba(0, 0, 0, 0.4))",
                      }}
                    />
                  </Tooltip>
                </Box>
              </Box>
              <TableContainer>
                <Table sx={{ minWidth: 2500 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />
                  <TableBody>
                    {Array.isArray(rows) &&
                      filterRows(rows, selectStartDate, selectEndDate, searchRfid)
                        .filter((row) =>
                          selectedSite ? row.cloud_site === selectedSite : true
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
                              <TableCell align="center">{row.rfid}</TableCell>
                              <TableCell align="center">
                                {row.trainee_fullname}
                              </TableCell>
                              <TableCell align="center">
                                {row.cloud_site}
                              </TableCell>
                              <TableCell align="center">
                                {moment(row.startDate).format("MM/DD/YYYY")}
                              </TableCell>
                              <TableCell align="center">
                                {moment(row.endDate).format("MM/DD/YYYY")}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  maxWidth: "250px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.leaveType}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  maxWidth: "250px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.reason}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  maxWidth: "250px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.period}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  maxWidth: "250px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.approved === "pending"
                                  ? "-"
                                  : row.mentorRemark}
                              </TableCell>
                              <TableCell align="center">
                                {row.mentor_fullname}
                              </TableCell>
                              <TableCell align="center">
                                {row.approved === "pending"
                                  ? "-"
                                  : moment(row.approvalDate).format(
                                    "MM/DD/YYYY, h:mm A"
                                  )}
                              </TableCell>
                              <TableCell align="left">
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
                              <TableCell align="center">
                                {moment(row.date).format("MM/DD/YYYY, h:mm A")}
                              </TableCell>
                            </TableRow>
                          );
                        }
                        )}
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
                  onChange={(event, value) => handleChangePage(event, value - 1)}
                />
              </Stack>
            </Paper>
          </Container>
        </ThemeProvider>
      </React.Fragment>
    </RequireAuthAdmin>
  );
}
