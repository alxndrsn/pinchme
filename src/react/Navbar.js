import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import HomeIcon from '@material-ui/icons/Home';
import MoreIcon from '@material-ui/icons/MoreVert';
import RefreshIcon from '@material-ui/icons/Refresh';

import AddressInput from './AddressInput';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function PrimarySearchAppBar({ goBack, goHome, history, onChangeUri, refresh, uri }) {
  const canGoBack = history.length > 1;

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const closeMobileMenu = () => setMobileMoreAnchorEl(false) || true;

  const closeHistoryMenu = () => setAnchorEl(null) || true;

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const showHistoryMenu = (event) => {
    if(canGoBack) setAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const historyMenuEntries = [...history];
  historyMenuEntries.pop();
  historyMenuEntries.reverse();
  const renderHistoryMenu = canGoBack && (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={closeHistoryMenu}
    >
      {historyMenuEntries.map((uri, idx) => (
        <MenuItem onClick={() => closeHistoryMenu() && goBack(idx)}>{uri}</MenuItem>
      ))}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={closeMobileMenu}
    >
      <MenuItem onClick={() => closeMobileMenu() && refresh()}>
        <IconButton aria-label="refresh page" color="inherit">
          <RefreshIcon/>
        </IconButton>
        <p>Refresh</p>
      </MenuItem>
      <MenuItem onClick={() => closeMobileMenu() && goHome()}>
        <IconButton aria-label="go to homepage" color="inherit">
          <HomeIcon/>
        </IconButton>
        <p>Refresh</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" aria-label="go back" color="inherit" onClick={() => canGoBack && goBack()} disabled={!canGoBack} onContextMenu={showHistoryMenu}>
            <ArrowBackIcon/>
          </IconButton>
          <AddressInput onSubmit={onChangeUri} defaultValue={uri} key={uri}/>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="refresh page" onClick={refresh} color="inherit" edge="end">
              <RefreshIcon/>
            </IconButton>
            <IconButton aria-label="go to homepage" onClick={goHome} color="inherit" edge="end">
              <HomeIcon/>
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderHistoryMenu}
      <Toolbar/> {/* leave space below */}
    </div>
  );
}
