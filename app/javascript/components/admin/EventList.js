import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";

import Header from "../Header";

import CreateEvent from "./CreateEvent";

import {
  Grid,
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Typography,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Input,
  Button,
  Snackbar
} from "@material-ui/core";

export default function EventList({
  events,
  setCurrentEvents,
  updateEvent,
  loadEvents,
  deleteEvent
}) {
  const { useState } = React;
  const [showStartDateError, setShowStartDateError] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const formatDate = date => new Date(date).toLocaleDateString();

  const handleEdit = row => {
    row.isEditMode = true;
    setCurrentEvents([...events]);
  };

  const handleSave = row => {
    row.isEditMode = false;
    updateEvent(row, () => {
      setOpen(true);
    });
  };

  const handleCancel = row => {
    row.isEditMode = false;
    setShowStartDateError(false);
    loadEvents();
  };

  const handleDelete = row => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirmed = row => {
    deleteEvent(row);
    setOpenDeleteDialog(false);
  };

  const handleStartDate = (event, row) => {
    let nd = new Date(event.target.value);
    var now = new Date();
    now.setHours(0, 0, 0, 0);

    if (nd < now) {
      setShowStartDateError(true);
      return;
    }

    row.start = new Date(
      nd.getTime() + Math.abs(nd.getTimezoneOffset() * 60 * 1000)
    );
  };

  const handleName = (event, row) => {
    row.name = event.target.value;
  };

  const handleDescription = (event, row) => {
    row.description = event.target.value;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <TableContainer component={Paper}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
      >
        <Alert>Success - event has been update.</Alert>
      </Snackbar>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Passcode</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(row => (
            <TableRow key={row.id}>
              <CustomTableCell
                inputType="text"
                row={row}
                name="name"
                value={row.name}
                onChange={handleName}
              />
              <CustomTableCell
                inputType="text"
                row={row}
                name="description"
                value={row.description}
                onChange={handleDescription}
              />
              <TableCell>{row.passcode}</TableCell>
              <CustomTableCell
                inputType="date"
                row={row}
                value={formatDate(row.start)}
                onChange={handleStartDate}
                showError={showStartDateError}
                errorMessage="Start date must be in future"
              />
              <TableCell>{formatDate(row.created_at)}</TableCell>
              <TableCell>
                {row.isEditMode ? (
                  <div>
                    <Button
                      color="primary"
                      onClick={() => {
                        handleSave(row);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => {
                        handleCancel(row);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button color="primary" onClick={() => handleEdit(row)}>
                      Edit
                    </Button>
                    <Button color="primary" onClick={() => handleDelete(row)}>
                      Delete
                    </Button>
                    <Dialog
                      open={openDeleteDialog}
                      onClose={handleDeleteDialogClose}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle id="form-dialog-title">
                        Are you sure you want to delete?
                      </DialogTitle>
                      <DialogActions>
                        <Button
                          onClick={handleDeleteDialogClose}
                          color="primary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleDeleteConfirmed(row)}
                          color="primary"
                        >
                          Confirm
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const CustomTableCell = ({
  row,
  inputType,
  name,
  value,
  onChange,
  showError,
  errorMessage
}) => {
  const { isEditMode } = row;

  return (
    <TableCell align="left">
      {isEditMode ? (
        <div>
          <Input
            type={inputType}
            defaultValue={row[name]}
            name={name}
            onChange={e => onChange(e, row)}
          />
          {showError && (
            <Alert variant="filled" color="error">
              {errorMessage}
            </Alert>
          )}
        </div>
      ) : (
        value
      )}
    </TableCell>
  );
};
