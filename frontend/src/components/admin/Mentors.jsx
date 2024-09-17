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
import CssBaseline from "@mui/material/CssBaseline";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Tooltip } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import DrawTwoToneIcon from "@mui/icons-material/DrawTwoTone";

import { lightTheme } from "../style.js";
import { ThemeProvider } from "@emotion/react";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import { stableSort, getComparator } from "../../utils/sortUtils";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../utils/FilterFunc";
import { IOSSwitch } from "../../utils/switch.jsx";

import { BACKEND_PORT, HOST } from "../../utils/constants.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Papa from "papaparse";
import icon from "../../assets/csv.png";

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
    id: "department",
    label: "Department",
  },
  {
    id: "building",
    label: "Building",
  },
  {
    id: "cloud_site",
    label: "Site",
  },
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
  onRequestSort: PropTypes.func.isRequired,
};

export default function Mentors() {
  const navigate = useNavigate();

  const [rows, setRows] = React.useState([]);
  const [searchRfid, setSearchRfid] = React.useState("");

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedSite, setSelectedSite] = React.useState("");
  const [selectStatus, setSelectedStatus] = React.useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEdit = (rfid) => {
    navigate(`/admin-mentor-data/${rfid}`);
  };

  const handleSearchRfidChange = (event) => {
    setSearchRfid(event.target.value);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const fetchMentor = async () => {
    try {
      const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/mentors`);
      const data = await response.json();
      setRows(data);
      console.log(data);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  const handleToggle = (event, rfid) => {
    const newStatus = event.target.checked;

    // Optimistically update the UI state
    const updatedRows = rows.map((row) =>
      row.rfid === rfid ? { ...row, acc_status: newStatus } : row
    );
    setRows(updatedRows);

    // Send request to update server-side
    fetch(`http://${HOST}:${BACKEND_PORT}/api/update-mentor/${rfid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ acc_status: newStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the updated mentor data
        // Optionally, update your local state or notify user of success
      })
      .catch((error) => {
        console.error('Error:', error);
        // Revert back to original state if update fails
        setRows(rows); // or fetch the data again to revert
      });
  };

  const exportToCsv = () => {
    const filteredRows = rows
      .filter((row) => !selectedSite || row.cloud_site === selectedSite)
      .filter((row) => !selectStatus || row.acc_status == selectStatus)
      .map(({ pwd, passwordUpdates, token, acc_status, ...rest }) => ({
        ...rest,
        acc_status: acc_status ? "Active" : "Inactive",
      }));

    const csv = Papa.unparse(filteredRows);
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const csvURL = window.URL.createObjectURL(csvData);
    let tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "mentors_export.csv");
    tempLink.click();
  };

  React.useEffect(() => {
    fetchMentor();
  }, []);

  const filteredAndSortedRows = stableSort(
    rows
      .filter((row) => {
        return (
          row.rfid.toLowerCase().includes(searchRfid.toLowerCase()) ||
          row.fullname.toLowerCase().includes(searchRfid.toLowerCase())
        );
      })
      .filter((row) => {
        return (
          (!selectedSite || row.cloud_site === selectedSite) &&
          (selectStatus === "" || (selectStatus === "1" ? row.acc_status : !row.acc_status))
        );
      }),
    getComparator(order, orderBy)
  );

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
                Supervisor / Mentor
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
                <FormControl sx={{ minWidth: 90, marginRight: 1 }} size="small">
                  <InputLabel id="site-select-label">Site</InputLabel>
                  <Select
                    labelId="site-select-label"
                    id="site-select"
                    value={selectedSite}
                    label="Site"
                    onChange={(e) => setSelectedSite(e.target.value)}
                    sx={{ height: 40, width: 120 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {[...new Set(rows.map((row) => row.cloud_site))].map((site) => (
                      <MenuItem key={site} value={site}>
                        {site}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 80, marginRight: 1 }} size="small">
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    value={selectStatus}
                    label="Status"
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    sx={{ height: 40, width: 120 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="1">Active</MenuItem>
                    <MenuItem value="0">Inactive</MenuItem>
                  </Select>
                </FormControl>
                <Tooltip title="export file">
                  <img
                    src={icon}
                    width={42}
                    height={42}
                    onClick={exportToCsv}
                    style={{ filter: "drop-shadow(3px 3px 1px rgba(0, 0, 0, 0.4))" }}
                  />
                </Tooltip>
              </Box>
              </Box>
              <TableContainer>
                <Table sx={{ minWidth: 900 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />
                  <TableBody>
                    {filteredAndSortedRows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                              {row.rfid ? row.rfid : "-"}
                            </TableCell>
                            <TableCell align="center">
                              {row.fullname ? row.fullname : "-"}
                            </TableCell>
                            <TableCell align="center">
                              {row.email ? row.email : "-"}
                            </TableCell>
                            <TableCell align="center">
                              {row.department ? row.department : "-"}
                            </TableCell>
                            <TableCell align="center">
                              {row.building ? row.building : "-"}
                            </TableCell>
                            <TableCell align="center">
                              {row.cloud_site ? row.cloud_site : "-"}
                            </TableCell>
                            <TableCell align="center" width="50px">
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
                                    onChange={(event) =>
                                      handleToggle(event, row.rfid)
                                    }
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
                  count={Math.ceil(filteredAndSortedRows.length / rowsPerPage)}
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