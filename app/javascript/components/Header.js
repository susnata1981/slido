import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const history = useHistory();
  const location = useLocation();
  const handleChange = event => {
    setAuth(event.target.checked);
  };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  }

  const handleListEvents = () => {
    history.push("/administrator");
    setAnchorEl(null);
  };

  const handleCreateEvents = () => {
    history.push("/administrator/create");
    setAnchorEl(null);
  };

  const handleJoinEvent = () => {
    history.push("/");
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let item = "";
  if (location.pathname.match("administrator") != null) {
    item = "Admin";
  } else {
    item = "Home";
  }
  const isAdmin = location.pathname.match("administrator") != null;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {item}
          <Typography variant="h6" className={classes.title}></Typography>
          {auth && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open}
                onClose={handleClose}
              >
                {isAdmin && (
                  <div>
                    <MenuItem onClick={handleJoinEvent}>Join Event</MenuItem>
                    <MenuItem onClick={handleListEvents}>List Event</MenuItem>
                    <MenuItem onClick={handleCreateEvents}>
                      Create Event
                    </MenuItem>
                  </div>
                )}
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
