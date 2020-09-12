import React, { useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";

export default function CustomAlert(props) {
  const { alertVisible, alertStatus, alertMessage } = props;

  return alertVisible && <Alert severity={alertStatus}>{alertMessage}</Alert>;
}
