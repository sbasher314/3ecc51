import React from "react";
import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";

const ProspectsAlert = ({
  alertMessage,
  setAlert
}) => {

  return (<Snackbar
    open={alertMessage.open}
    autoHideDuration={6000}
    onClose={() => {
      let newAlert = { ...alertMessage }
      newAlert.open = false;
      setAlert(newAlert);
    }}
    vertical="bottom"
    horizontal="center"
  >
    <Alert
      severity={alertMessage.severity}
      variant="filled"
    >
      {alertMessage.message}
    </Alert>
  </Snackbar>)

};

export default ProspectsAlert