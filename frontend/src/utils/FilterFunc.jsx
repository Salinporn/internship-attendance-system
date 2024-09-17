import React from "react";
import { Select, MenuItem, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

export function MonthSelect({ selectedMonth, setSelectedMonth }) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Select
      value={selectedMonth}
      onChange={(event) => setSelectedMonth(event.target.value)}
      sx={{ marginRight: 2 }}
      size="small"
    >
      {months.map((month, index) => (
        <MenuItem key={index} value={index}>
          <Typography variant="caption">{month}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
}

export function YearSelect({ selectedYear, setSelectedYear }) {
  const generateYearList = (numberOfYears) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: numberOfYears }, (v, i) => currentYear - i);
  };

  return (
    <Select
      value={selectedYear}
      size="small"
      sx={{ marginRight: 2 }}
      onChange={(event) => setSelectedYear(event.target.value)}
    >
      {generateYearList(5).map((year, index) => (
        <MenuItem key={index} value={year}>
          <Typography variant="caption">{year}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
}

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  backgroundColor: "#edf0f5",
  color: "inherit",
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

// for absence - admin n mentor
export const filterRows = (
  rows,
  selectStartDate,
  selectEndDate,
  searchRfid
) => {
  if (!Array.isArray(rows)) {
    console.error("rows is not an array");
    return [];
  }
  return rows.filter((row) => {
    if (selectStartDate && selectEndDate && row.startDate && row.endDate) {
      const start = new Date(
        selectStartDate.toISOString().split("T")[0]
      ).getTime();
      const end = new Date(selectEndDate.toISOString().split("T")[0]).getTime();
      const rowStartDate = new Date(row.startDate.split("T")[0]).getTime();
      const rowEndDate = new Date(row.endDate.split("T")[0]).getTime();
      return (
        rowStartDate >= start &&
        rowEndDate <= end &&
        (row.rfid.toLowerCase().includes(searchRfid.toLowerCase()) ||
          row.trainee_fullname.toLowerCase().includes(searchRfid.toLowerCase()))
      );
    } else {
      return (
        row.rfid.toLowerCase().includes(searchRfid.toLowerCase()) ||
        row.trainee_fullname.toLowerCase().includes(searchRfid.toLowerCase())
      );
    }
  });
};
// for time in out - admin n mentor
export const filterRowsCico = (
  rows,
  selectStartDate,
  selectEndDate,
  searchRfid
) => {
  if (!Array.isArray(rows)) {
    console.error("rows is not an array");
    return [];
  }
  return rows.filter((row) => {
    const start = selectStartDate
      ? new Date(selectStartDate.toISOString().split("T")[0]).getTime()
      : null;
    const end = selectEndDate
      ? new Date(selectEndDate.toISOString().split("T")[0]).getTime()
      : null;

    const rowDate = row.date
      ? new Date(row.date.split("T")[0]).getTime()
      : null;

    let rfidMatch =
      row.rfid && typeof row.rfid === "string"
        ? row.rfid.toLowerCase().includes(searchRfid.toLowerCase())
        : false;
    let fullnameMatch =
      row.fullname && typeof row.fullname === "string"
        ? row.fullname.toLowerCase().includes(searchRfid.toLowerCase())
        : false;

    let dateMatch = true;
    if (start !== null && end !== null && rowDate !== null) {
      dateMatch = rowDate >= start && rowDate <= end;
    }

    return dateMatch && (rfidMatch || fullnameMatch);
  });
};

// for time in out - admin n mentor
export const filterRowsTimeAttendance = (
  rows,
  selectStartDate,
  selectEndDate,
  searchRfid
) => {
  if (!Array.isArray(rows)) {
    console.error("rows is not an array");
    return [];
  }
  return rows.filter((row) => {
    if (selectStartDate && selectEndDate && row.startDate && row.endDate) {
      const start = new Date(
        selectStartDate.toISOString().split("T")[0]
      ).getTime();
      const end = new Date(selectEndDate.toISOString().split("T")[0]).getTime();
      const rowStartDate = new Date(
        row.startDateWithNoTime.split("T")[0]
      ).getTime();
      const rowEndDate = new Date(
        row.endDateWithNoTime.split("T")[0]
      ).getTime();
      return (
        rowStartDate >= start &&
        rowEndDate <= end &&
        (row.rfid.toLowerCase().includes(searchRfid.toLowerCase()) ||
          row.trainee_fullname.toLowerCase().includes(searchRfid.toLowerCase()))
      );
    } else {
      return (
        row.rfid.toLowerCase().includes(searchRfid.toLowerCase()) ||
        row.trainee_fullname.toLowerCase().includes(searchRfid.toLowerCase())
      );
    }
  });
};
