import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme } from "../style.js";
import { ThemeProvider } from "@emotion/react";
import AdminNavbar from "../navbar/AdminNavbar.jsx";
import { RequireAuthAdmin } from "../../utils/requireAuth.jsx";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, TableSortLabel, Box, Pagination, Stack
} from "@mui/material";
import DrawTwoToneIcon from "@mui/icons-material/DrawTwoTone";
import { stableSort, getComparator } from "../../utils/sortUtils";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
    Search, SearchIconWrapper, StyledInputBase,
} from "../../utils/FilterFunc";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { HOST, BACKEND_PORT } from "../../utils/constants.jsx";
import { IOSSwitch } from "../../utils/switch.jsx";

const headCells = [
    { id: "id", label: "No." },
    { id: "reason", label: "Reason" },
    { id: "detail", label: "Detail" },
    { id: "reason_status", label: "Status" }
];

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
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
        top: 20,
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

function TimeAdjustmentReasons() {
    const navigate = useNavigate();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [timeAdjReasons, setTimeAdjReasons] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchtimeAdjReasons = async () => {
        try {
            const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/reason`);
            const jsonData = await response.json();
            setTimeAdjReasons(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchtimeAdjReasons();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleEditClick = (id) => {
        navigate(`/admin-adjustment-reason/${id}`);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleToggle = async (event, id) => {
        const newStatus = event.target.checked ? 1 : 0;

        // Update the local state optimistically
        setTimeAdjReasons(prevState =>
            prevState.map(reason =>
                reason.id === id ? { ...reason, reason_status: newStatus } : reason
            )
        );

        try {
            const response = await fetch(`http://${HOST}:${BACKEND_PORT}/api/update-reason-status/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reason_status: newStatus }),  // Send the constructed request body
            });

        } catch (error) {
            console.error("Error updating reason status:", error);
            // Rollback the state update on error
            setTimeAdjReasons(prevState =>
                prevState.map(reason =>
                    reason.id === id ? { ...reason, reason_status: !newStatus } : reason
                )
            );
        }
    };

    const filteredRows = timeAdjReasons.filter(reason =>
        reason.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedRows = stableSort(filteredRows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                        <Paper elevation={2} sx={{ width: "100%", mb: 2 }}>
                            <Typography
                                sx={{
                                    flex: "1 1 100%",
                                    paddingTop: "16px",
                                    paddingBottom: "20px",
                                }}
                                variant="h5"
                                id="tableTitle"
                                component="div"
                            >
                                Time Adjustment Reason
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    paddingBottom: "16px",
                                    paddingRight: "16px",
                                    alignItems: "end",
                                    justifyContent: "end",
                                    paddingLeft: "10px",
                                }}
                            >
                                <Search sx={{ marginRight: 1 }}>
                                    <SearchIconWrapper>
                                        <SearchRoundedIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Reason"
                                        inputProps={{ "aria-label": "search" }}
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </Search>
                                <Tooltip title="Add New Reason" aria-label="add_type">
                                    <AddIcon
                                        onClick={() => navigate("/admin-add-adjustment-reason")}
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
                                        {sortedRows.map((row, index) => (
                                            <TableRow hover key={row.id}>
                                                <TableCell align="center" width="100px">{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell align="center">{row.reason}</TableCell>
                                                <TableCell align="center" width="100px">
                                                    <Tooltip title="Edit detail">
                                                        <DrawTwoToneIcon
                                                            sx={{
                                                                cursor: "pointer",
                                                                color: "#3d2c9d",
                                                                marginRight: '20px'
                                                            }}
                                                            onClick={() => handleEditClick(row.id)}
                                                        />
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="center" width="100px">
                                                    <Tooltip title="active / inactive reason">
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '20px' }}>
                                                            <IOSSwitch
                                                                checked={!!row.reason_status} // Ensure it's a boolean
                                                                onChange={(event) =>
                                                                    handleToggle(event, row.id)
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
                                    count={Math.ceil(filteredRows.length / rowsPerPage)}
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

export default TimeAdjustmentReasons;
