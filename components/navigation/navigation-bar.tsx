import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import React from "react";
import { MdMenu } from "react-icons/md";
import { Gutter } from "../app/gutter";
import { LogoTypography } from "../app/logo";
import { NavigationHorizontalLinks } from "./navigation-links";
import { useNavigationState } from "./navigation-state";

export const useStyles = makeStyles((theme) => ({
  toolbar: {
    margin: "auto",
    maxWidth: theme.breakpoints.width("lg"),
    width: "100%",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  appBar: {
    zIndex: theme.zIndex.appBar,
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    color: theme.palette.getContrastText(theme.palette.background.default),
    backgroundColor: theme.palette.primary.main,
  },
}));

export const NavigationBar = React.forwardRef<any, { title: string }>(
  ({ title }, ref) => {
    const classes = useStyles();

    const navigationState = useNavigationState();

    return (
      <>
        <Hidden implementation="css" smDown>
          <AppBar ref={ref} className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <LogoTypography title={title} />

              <Box flex={1} />

              <NavigationHorizontalLinks />
            </Toolbar>
          </AppBar>
        </Hidden>

        <Hidden implementation="css" mdUp>
          <AppBar ref={ref} className={classes.appBar}>
            <Toolbar className={clsx(classes.toolbar, classes.spaceBetween)}>
              <IconButton
                edge="start"
                aria-label="open navigation bar"
                onClick={() => {
                  navigationState.setDrawerState("opened");
                }}
              >
                <MdMenu />
              </IconButton>

              <LogoTypography title={title} />

              <Box width="32px" height="32px" />
            </Toolbar>
          </AppBar>
        </Hidden>

        <Gutter />
      </>
    );
  }
);
