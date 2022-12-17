import * as React from 'react';
import { useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ListSingleModal(props) {
  const [open, setOpen] = React.useState(false);
  const [enteredAmount, setEnteredAmount] = useState(undefined);

  const AmountChangeHandler = (event) => {
    event.preventDefault();        
    setEnteredAmount(event.target.value);
}

  const handleClickOpen = () => {
    setOpen(true);
   
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleList = async(event) => {
    props.onList(event.target.value);
    setOpen(false);
  };


  return (
    <div>
      <Button variant="text" size="small" sx={{color: 'red'}} onClick={handleClickOpen}>
        List
      </Button>
      <Dialog open={open} onClose={handleClose} >
        <DialogTitle style={{fontFamily: 'Alegreya Sans SC', backgroundColor: 'black', color: 'red'}}>UG Resurrection Market</DialogTitle>
        <DialogContent style={{backgroundColor: 'red'}}>
          <DialogContentText style={{fontFamily: 'Alegreya Sans SC', backgroundColor: 'red', color: 'black'}}>
            Enter Listing Price in $Blood
          </DialogContentText >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Listing Price"
            type="number"
            fullWidth
            variant="standard"
            style={{fbackgroundColor: 'red'}}
            onChange={AmountChangeHandler}
          />
        </DialogContent>
        <DialogActions style={{backgroundColor: 'red', color: 'black'}}>
          <Button variant="text" sx={{fontFamily: 'Alegreya Sans SC',color: 'black'}} onClick={handleClose}>Cancel</Button>
          <Button variant="text" sx={{fontFamily: 'Alegreya Sans SC',color: 'black'}} value={enteredAmount} onClick={handleList}>List</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
