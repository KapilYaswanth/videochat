import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Phone, PhoneDisabled, Assignment } from "@material-ui/icons";
import { SocketContext } from "../SocketContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  gridContainer: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  container: {
    width: "600px",
    margin: "35px 0",
    padding: 0,
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: "10px 20px",
    border: "2px solid black",
  },
}));

const Options = ({ children }) => {
  const classes = useStyles();
  const { me, callAccepted, name, setName, leaveCall, callUser, callEnded } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  return (
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form noValidate autoComplete="off" className={classes.root}>
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={6} lg={6} className={classes.padding}>
              <Typography variant="h6" gutterBottom>
                Account Info
              </Typography>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <CopyToClipboard text={me} className={classes.margin}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Assignment fontSize="large" />}
                >
                  Copy Your ID
                </Button>
              </CopyToClipboard>
            </Grid>
            <Grid item xs={12} md={6} lg={6} className={classes.padding}>
              <Typography variant="h6" gutterBottom>
                Make a Call
              </Typography>
              <TextField
                label="ID to Call"
                value={idToCall}
                onChange={(e) => {
                  setIdToCall(e.target.value);
                }}
              />
              {callAccepted && !callEnded ? (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PhoneDisabled fontSize="large" />}
                  fullWidth
                  onClick={leaveCall}
                  className={classes.margin}
                >
                  Hang up
                </Button>
              ) : (
                <Button variant="contained"
                color="primary"
                startIcon={<Phone fontSize="large" />}
                fullWidth
                onClick={() => {callUser(idToCall)}}
                className={classes.margin}>Call</Button>
              )}
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
};

export default Options;
