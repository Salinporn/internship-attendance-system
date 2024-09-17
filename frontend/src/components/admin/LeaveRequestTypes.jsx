import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme } from "../style.js";
import { ThemeProvider } from "@emotion/react";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Box, TableSortLabel } from "@mui/material";
import DrawTwoToneIcon from "@mui/icons-material/DrawTwoTone";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { IOSSwitch } from "../../utils/switch.jsx";
import { stableSort, getComparator } from "../../utils/sortUtils";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
    Search,
    SearchIconWrapper,
    StyledInputBase,
} from "../../utils/FilterFunc";
import { HOST, BACKEND_PORT } from "../../utils/constants.jsx";

const headCells = [
    { id: 'id', label: 'No.' },
    { id: 'leaveType', label: 'Type' },
    { id: 'subtypes', label: 'Subtypes' },
    { id: 'edit_details', label: 'Detail' },
    { id: 'type_status', label: 'Status' },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead style={{ backgroundColor: "#f9e4ff" }}>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align="center">
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    onRequestSort: PropTypes.func.isRequired,
};

function LeaveRequestTypes() {
    const navigate = useNavigate();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [leaveTypes, setLeaveTypes] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState(""); // State for search query

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleToggle = async (event, id) => {
        const newStatus = event.target.checked ? 1 : 0;

        // Find the leave type that needs to be updated
        const leaveTypeToUpdate = leaveTypes.find(leaveType => leaveType.id === id);

        if (!leaveTypeToUpdate) {
            console.error('Leave type not found');
            return;
        }

        // Filter out null or invalid subtypes
        const validSubtypes = (leaveTypeToUpdate.subtypes || [])
            .map(subtype => subtype.subtype)
            .filter(subtype => subtype !== null && subtype !== undefined && subtype.trim() !== "");

        const updatedLeaveTypes = leaveTypes.map(leaveType =>
            leaveType.id === id ? { ...leaveType, type_status: newStatus } : leaveType
        );
        setLeaveTypes(updatedLeaveTypes);

        try {
            const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/update-leavetype-subtype/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    leaveType: leaveTypeToUpdate.leaveType, // Include current leave type
                    type_status: newStatus,
                    subtypes: validSubtypes // Send only valid subtypes
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonData = await response.json();
            // console.log("Server response:", jsonData);

            // Ensure the response includes the updated leave type
            if (jsonData && jsonData.updatedLeaveType) {
                setLeaveTypes(prevLeaveTypes =>
                    prevLeaveTypes.map(leaveType =>
                        leaveType.id === id ? jsonData.updatedLeaveType : leaveType
                    )
                );
            } else {
                console.error("Expected updatedLeaveType in response but got:", jsonData);
            }

        } catch (error) {
            console.error("Error updating leave type status:", error);

            // Revert local state back if API call fails
            const revertedLeaveTypes = leaveTypes.map(leaveType =>
                leaveType.id === id ? { ...leaveType, type_status: !newStatus } : leaveType
            );
            setLeaveTypes(revertedLeaveTypes);
        }
    };


    const fetchLeaveTypes = async () => {
        try {
            const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/leavetype-subtype`);
            const jsonData = await response.json();
            console.log("Fetched leave types:", jsonData);

            // Ensure the response is an array before setting the state
            if (Array.isArray(jsonData)) {
                setLeaveTypes(jsonData);
            } else {
                console.error("Expected an array but got:", jsonData);
            }
        } catch (err) {
            console.error('Fetch error:', err.message);
        }
    };

    React.useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const filteredLeaveTypes = leaveTypes.filter((leaveType) =>
        leaveType.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (leaveType.subtypes && leaveType.subtypes.some(subtype =>
            subtype.subtype.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );

    return (
        <RequireAuthAdmin>
            <React.Fragment>
                <ThemeProvider theme={lightTheme}>
                    <AdminNavbar />
                    <CssBaseline />
                    <Container
                        maxWidth="xl"
                        sx={{
                            paddingTop: "100px",
                            minHeight: "100vh",
                            minWidth: "90vw",
                        }}
                    >
                        <Paper elevation={2} sx={{ width: "100%" }}>
                            <Typography
                                sx={{
                                    flex: "1 1 100%",
                                    paddingTop: "16px"
                                }}
                                variant="h5"
                                id="tableTitle"
                                component="div"
                            >
                                Leave Request Type
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    padding: "16px",
                                    alignItems: "end",
                                    justifyContent: "end",
                                }}
                            >
                                <Search sx={{ marginRight: 2 }}>
                                    <SearchIconWrapper>
                                        <SearchRoundedIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Type, Subtype"
                                        inputProps={{ "aria-label": "search" }}
                                        value={searchQuery} // Set the search query value
                                        onChange={handleSearchChange} // Handle input changes
                                    />
                                </Search>
                                <Tooltip title="Add New Type" aria-label="add_type">
                                    <AddIcon
                                        onClick={() => navigate("/admin-add-leave-type")}
                                        sx={{
                                            cursor: "pointer",
                                            color: "white",
                                            borderRadius: "50%",
                                            padding: "5px",
                                            width: "35px",
                                            height: "35px",
                                            backgroundColor: "#9b5afe",
                                        }}
                                    />
                                </Tooltip>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <EnhancedTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                    />
                                    <TableBody>
                                        {stableSort(filteredLeaveTypes, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((leaveType, index) => (
                                                <TableRow key={leaveType.id} hover>
                                                    <TableCell align="center" width="100px">{page * rowsPerPage + index + 1}</TableCell>
                                                    <TableCell align="center" maxWidth="150px">{leaveType.leaveType}</TableCell>
                                                    <TableCell align="center" maxWidth="150px">
                                                        {leaveType.subtypes && leaveType.subtypes.length > 0 ? (
                                                            leaveType.subtypes.map((subtypeObj, idx) => (
                                                                <div key={idx}>
                                                                    {subtypeObj.subtype} {
                                                                        subtypeObj.subtype_status ? (
                                                                            <Box
                                                                                component="span"
                                                                                sx={{
                                                                                    display: 'inline-block',
                                                                                    width: '10px',
                                                                                    height: '10px',
                                                                                    borderRadius: '50%',
                                                                                    backgroundColor: '#4caf50',
                                                                                    marginRight: '5px',
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <Box
                                                                                component="span"
                                                                                sx={{
                                                                                    display: 'inline-block',
                                                                                    width: '10px',
                                                                                    height: '10px',
                                                                                    borderRadius: '50%',
                                                                                    backgroundColor: 'lightgrey',
                                                                                    marginRight: '5px',
                                                                                }}
                                                                            />
                                                                        )
                                                                    }
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    display: 'inline-block',
                                                                    width: '10px',
                                                                    height: '10px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'lightgrey',
                                                                    marginRight: '5px',
                                                                }}
                                                            />
                                                        )}
                                                    </TableCell>


                                                    <TableCell align="center" width="50px" >
                                                        <Tooltip title="edit detail">
                                                            <DrawTwoToneIcon
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    color: "#3d2c9d",
                                                                    marginRight: '20px'
                                                                }}
                                                                onClick={() => navigate(`/admin-leave-type/${leaveType.id}`)}
                                                            />
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell align="center" width="50px" >
                                                        <Tooltip title="active / inactive leave type">
                                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '20px' }}>
                                                                <IOSSwitch
                                                                    checked={!!leaveType.type_status}
                                                                    onChange={(event) =>
                                                                        handleToggle(event, leaveType.id)
                                                                    }
                                                                />
                                                            </Box>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
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
                                    count={Math.ceil(filteredLeaveTypes.length / rowsPerPage)}
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

export default LeaveRequestTypes;
