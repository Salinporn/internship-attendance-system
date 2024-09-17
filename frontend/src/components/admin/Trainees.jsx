import React, { Component } from "react";
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
import CssBaseline from "@mui/material/CssBaseline";
import TableSortLabel from "@mui/material/TableSortLabel";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { ToastContainer } from "react-toastify";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { Tooltip } from "@mui/material";
import DrawTwoToneIcon from "@mui/icons-material/DrawTwoTone";

import { lightTheme } from "../style.js";
import { ThemeProvider } from "@emotion/react";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import { stableSort, getComparator } from "../../utils/sortUtils";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  filterRows
} from "../../utils/FilterFunc";
import { IOSSwitch } from "../../utils/switch.jsx";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import icon from "../../assets/csv.png";
import Papa from "papaparse";
import moment from "moment";
import { toastError } from "../../utils/toastNotifications";

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
    id: "email",
    label: "Email",
  },
  {
    id: "cloud_site",
    label: "Site",
  },
  {
    id: "start_date",
    label: "Start Date",
  },
  {
    id: "end_date",
    label: "End Date",
  },

  { id: "mentor_name", label: "Mentor Name" },

  {
    id: "account_details",
    label: "Details",
  },
  {
    id: "acc_status",
    label: "Status",
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
    <TableHead style={{ backgroundColor: "#f9e4ff" }}>
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
  onRequestSort: PropTypes.func.isRequired, // You might want to change this to handleRequestSort
};

export default function Trainees() {
  const navigate = useNavigate();

  const [rows, setRows] = React.useState([]);
  const [searchRfid, setSearchRfid] = React.useState("");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectStartDate, setSelectStartDate] = React.useState(null); // State for start date
  const [selectEndDate, setSelectEndDate] = React.useState(null); // State for end date
  const [selectedSite, setSelectedSite] = React.useState("");
  const [selectStatus, setSelectedStatus] = React.useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEdit = (rfid) => {
    navigate(`/admin-trainee-data/${rfid}`);
  };

  const handleSearchRfidChange = (event) => {
    setSearchRfid(event.target.value);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedData = stableSort(
      rows,
      getComparator(isAsc ? "desc" : "asc", property)
    );
    setRows(sortedData);
  };

  const exportToCsv = () => {
    const filteredRows = filterRows(
      rows,
      selectStartDate,
      selectEndDate,
      searchRfid,
      selectedSite,
      selectStatus
    ).filter((row) => {
      return (
        (!selectedSite || row.cloud_site === selectedSite) &&
        (selectStatus === "" || (selectStatus === "1" ? row.acc_status : !row.acc_status))
      );
    })
      .filter((row) => { return filterRowsByDate([row], selectStartDate, selectEndDate).length > 0; });

    const rowsForCsv = filteredRows.map(row => ({
      ...row,
      acc_status: row.acc_status ? 'Active' : 'Inactive'
    }));

    const csv = Papa.unparse(rowsForCsv);
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const csvURL = window.URL.createObjectURL(csvData);
    let tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "export.csv");
    tempLink.click();
  };


  const filterRowsByDate = (rows, startDate, endDate) => {
    if (!Array.isArray(rows)) {
      console.error("rows is not an array");
      return [];
    }
    return rows.filter((row) => {
      if (startDate && endDate && row.start_date && row.end_date) {
        return (
          new Date(row.start_date) >= startDate && new Date(row.end_date) <= endDate
        );
      } else if (startDate && row.start_date) {
        return new Date(row.start_date) >= startDate;
      } else if (endDate && row.end_date) {
        return new Date(row.end_date) <= endDate;
      } else {
        return true;
      }
    });
  };

  const fetchTrainees = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/get-trainees`);
      const data = await response.json();
      setRows(data);
      console.log(data);
    } catch (error) {
      console.log("Error fetching trainee details: ", error);
    }
  };

  const handleToggle = (event, rfid) => {
    const isChecked = event.target.checked;

    const currentRow = rows.find((row) => row.rfid === rfid);
    if (isChecked && currentRow && new Date(currentRow.end_date) < new Date()) {
      toastError("Cannot activate an expired account");
      return;
    }

    const updatedRows = rows.map((row) =>
      row.rfid === rfid ? { ...row, acc_status: isChecked } : row
    );
    setRows(updatedRows);

    fetch(`http://${HOST}:${BACKEND_PORT}/api/update-trainee-account-status/${rfid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ acc_status: isChecked ? 1 : 0 }),
    })
      .then((response) => response.json())
      .then((data) =>
        console.log(data)
      )
      .catch((error) => {
        console.error("Error:", error);
        setRows(rows);
      });
  };


  React.useEffect(() => {
    fetchTrainees();
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
            <Paper elevation={2} sx={{ width: "100%", mb: 2 }}>
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
                Internship Student
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
                    marginBottom: { xs: 1, md: 0 }, // Add margin bottom only on small screens
                  }}
                >
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
                    marginBottom: { xs: 1, md: 0 }, // Add margin bottom only on small screens
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="From"
                      value={selectStartDate}
                      onChange={(newValue) => {
                        setSelectStartDate(newValue);
                      }}
                      slotProps={{ textField: { size: "small" } }}
                      sx={{ marginRight: 1, width: 140, minWidth: 60 }}
                    />
                    <DatePicker
                      label="To"
                      value={selectEndDate}
                      onChange={(newValue) => {
                        setSelectEndDate(newValue);
                      }}
                      slotProps={{ textField: { size: "small" } }}
                      sx={{ marginRight: 1, width: 140, minWidth: 60 }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FormControl sx={{ minWidth: 80, marginRight: 1 }} size="small">
                    <InputLabel id="site-select-label">Site</InputLabel>
                    <Select
                      labelId="site-select-label"
                      id="site-select"
                      value={selectedSite}
                      label="Site"
                      onChange={(e) => setSelectedSite(e.target.value)}
                      sx={{ height: 40, width: 120 }} // Adjust width as necessary
                    >
                      <MenuItem value="">All</MenuItem>
                      {[...new Set(rows.map((row) => row.cloud_site))].map((site) => (
                        <MenuItem key={site} value={site}>
                          {site}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 90, marginRight: 1 }} size="small">
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      id="status-select"
                      value={selectStatus}
                      label="Status"
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      sx={{ height: 40, width: 120 }} // Adjust width as necessary
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="1">Active</MenuItem>
                      <MenuItem value="0">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                  <Tooltip title="Export file">
                    <img
                      src={icon}
                      width={42}
                      height={42}
                      onClick={exportToCsv}
                      style={{
                        filter: "drop-shadow(3px 3px 1px rgba(0, 0, 0, 0.4))",
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                </Box>
              </Box>

              <TableContainer>
                <Table sx={{ minWidth: "auto" }} aria-labelledby="tableTitle">
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
                          return (
                            (!selectedSite || row.cloud_site === selectedSite) &&
                            (selectStatus === "" || (selectStatus === "1" ? row.acc_status : !row.acc_status))
                          );
                        })
                        .filter(row => {
                          return filterRowsByDate(
                            [row],
                            selectStartDate,
                            selectEndDate
                          ).length > 0;
                        })
                        .filter(row => {
                          return (
                            row.rfid.toLowerCase().includes(searchRfid.toLowerCase()) ||
                            row.fullname.toLowerCase().includes(searchRfid.toLowerCase())
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
                                width="20px"
                              >
                                {page * rowsPerPage + index + 1}
                              </TableCell>
                              <TableCell align="center">
                                {row.rfid ? row.rfid : "-"}
                              </TableCell>
                              <TableCell align="center">
                                {row.fullname ? row.fullname : "-"}
                              </TableCell>
                              <TableCell align="center">
                                {row.email ? row.email : "-"}
                              </TableCell>
                              <TableCell align="center">
                                {row.cloud_site ? row.cloud_site : "-"}
                              </TableCell>
                              <TableCell align="center">
                                {row.start_date ? moment(new Date(row.start_date)).format("MM/DD/YYYY") : "-"}
                              </TableCell>
                              <TableCell align="center">
                                {row.end_date ? moment(new Date(row.end_date)).format("MM/DD/YYYY") : "-"}

                              </TableCell>

                              <TableCell align="center">
                                {row.mentor_name ? row.mentor_name : "-"}
                              </TableCell>

                              <TableCell align="center" width="50px" >
                                <Tooltip title="edit / view">
                                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '20px' }}>
                                    <DrawTwoToneIcon
                                      onClick={() => handleEdit(row.rfid)}
                                      sx={{
                                        cursor: "pointer",
                                        color: "#3d2c9d",
                                      }}
                                    />
                                  </Box>
                                </Tooltip>
                              </TableCell>
                              <TableCell align="center" width="50px">
                                <Tooltip title="active / inactive account">
                                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '20px' }}>
                                    <IOSSwitch
                                      checked={row.acc_status}
                                      onChange={(event) => handleToggle(event, row.rfid)}
                                    />
                                  </Box>
                                </Tooltip>
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
                  onChange={(event, value) => handleChangePage(event, value - 1)}
                />
              </Stack>
            </Paper>
          </Container>
        </ThemeProvider>

        <ToastContainer />
      </React.Fragment>
    </RequireAuthAdmin>
  );
}
