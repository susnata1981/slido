import React, { useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";

export default function CustomAlert(props) {
  const { isVisible, status, message } = props;

  return isVisible && <Alert severity={status}>{message}</Alert>;
}
