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
import TableSortLabel from "@mui/material/TableSortLabel";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Papa from "papaparse";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import icon from "../../assets/csv.png";
import { lightTheme } from "../style.js";
import { ThemeProvider } from "@emotion/react";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import { stableSort, getComparator } from "../../utils/sortUtils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { filterRowsCico, Search, SearchIconWrapper, StyledInputBase } from "../../utils/FilterFunc";
import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";
import { Select, MenuItem, Tooltip, FormControl, InputLabel } from "@mui/material";

const headCells = [
  { id: "id", label: "No." },
  { id: "rfid", label: "RFID" },
  { id: "fullname", label: "Name" },
  { id: "cloud_site", label: "Site" },
  { id: "clockIn", label: "Clock In" },
  { id: "clockOut", label: "Clock Out" },
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
    <TableHead style={{ backgroundColor: "#cee5d8" }}>
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

export default function AdminClockInClockOut() {
  const [rows, setRows] = React.useState([]);
  const [searchRfid, setSearchRfid] = React.useState("");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);
  const [selectStartDate, setSelectStartDate] = React.useState(null);
  const [selectEndDate, setSelectEndDate] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedSite, setSelectedSite] = React.useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const exportToCsv = () => {
    const filteredRows = filterRowsCico(
      rows,
      selectStartDate,
      selectEndDate,
      searchRfid
    ).filter((row) => !selectedSite || row.cloud_site === selectedSite);
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

  const fetchTimeAdjustments = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/get-new-cico`);
      const data = await response.json();
      setRows(data);
      console.log(data);
    } catch (error) {
      console.log("Error fetching time adjustments: ", error);
    }
  };

  React.useEffect(() => {
    fetchTimeAdjustments();
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
              background: "black.900",
              minHeight: "100vh",
              minWidth: "100vw",
            }}
          >
            <Paper elevation={2} sx={{ width: "100%", mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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
                  View Event: Internship Attendance Record
                </Typography>
              </Box>
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
                      <SearchRoundedIcon style={{ color: "#2d2d2d" }} />
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
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                </Box>
              </Box>
              <TableContainer>
                <Table sx={{ minWidth: 0 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />
                  <TableBody>
                    {Array.isArray(rows) &&
                      filterRowsCico(rows, selectStartDate, selectEndDate, searchRfid)
                        .filter((row) => !selectedSite || row.cloud_site === selectedSite)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={row.id}
                              sx={{ cursor: "pointer" }}
                            >
                              <TableCell align="center" component="th" scope="row" padding="none">
                                {page * rowsPerPage + index + 1}
                              </TableCell>
                              <TableCell align="center">{row.rfid}</TableCell>
                              <TableCell align="center">{row.fullname}</TableCell>
                              <TableCell align="center">{row.cloud_site}</TableCell>
                              <TableCell align="center">
                                {row.clockIn === null ? "-" : moment(row.clockIn).format("MM/DD/YYYY, h:mm:ss A")}
                              </TableCell>
                              <TableCell align="center">
                                {row.clockOut === null ? "-" : moment(row.clockOut).format("MM/DD/YYYY, h:mm:ss A")}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack spacing={2} justifyContent="center" alignItems="center" sx={{ pt: 1, pb: 1 }}>
                <Pagination
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
