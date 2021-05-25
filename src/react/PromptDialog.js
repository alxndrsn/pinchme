import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default ({ text, sensitive, onSuccess, onFailure }) => {
  if(!text) return null;

  const [ value, setValue ] = React.useState('');

  const cleanup = () => setValue('');

  const handleCancel  = () => cleanup() || onFailure('cancelled')
  const handleSuccess = () => cleanup() || onSuccess(value);
  const handleSubmit = e => e.preventDefault() || handleSuccess();

  const inputType = sensitive ? 'password' : 'text';

  return (
    <Dialog open onClose={handleCancel} aria-labelledby="prompt-dialog-title">
      <form onSubmit={handleSubmit}>
        <DialogTitle id="prompt-dialog-title">Input</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
          <TextField autoFocus margin="dense" id="prompt-dialog-input" label="" type={inputType} fullWidth value={value} onChange={e => setValue(e.target.value)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSuccess} color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
