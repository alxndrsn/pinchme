import React from 'react';

import { fade, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const SCHEME = 'gemini://';

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    color: theme.palette.common.white,
    zIndex: 1,
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon
    paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

export default ({ defaultValue, onSubmit }) => {
  const classes = useStyles();
  const [ value, setValue ] = React.useState(defaultValue || '');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(value.startsWith(SCHEME) ? value : SCHEME + value);
  };

  return (
    <div className={classes.search}>
      <form onSubmit={handleSubmit}>
        <Button className={classes.searchIcon} onClick={handleSubmit}>
          <PlayArrowIcon/>
        </Button>
        <InputBase
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          value={value}
          inputProps={{ 'aria-label':'address' }}
          onChange={e => { setValue(e.target.value); }}
          style={{width:'100%'}}
        />
      </form>
    </div>
  );
};
