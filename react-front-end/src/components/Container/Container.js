import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Container as Partial } from '@material-ui/core/';
import AccountReport  from './AccountReport/AccountReport';
import TransactionTable from './TransactionTable/TransactionTable';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import './Container.scss';
import {useApplicationData} from "../../hooks/useApplicationData"
import { getCategoryByName,getTransactionTypeByName,getAccountByName} from '../../helpers/selectors';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import {Select, MenuItem,InputLabel} from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles({
  partial: {
    backgroundColor: '#EFEEEE',
    height: '90vh',
    marginTop: '6em'
  },
  button: {
    marginTop: '3.5em',
    marginLeft: '5em',
    backgroundColor:'#01234c',
    "&:hover": {
      backgroundColor: '#a6d0ef'
    },
    fontSize: '12px'
  },
  formControl: {
    width: 500,
    padding: '0 1em'
  }
});

export default function Container(props) {
  const classes = useStyles();
  const {
    state,
    addCategory,
    addTransactions
  } = useApplicationData()

  const [input, setInput] = useState(0);
  const [open, setOpen] = useState(false);

  //handling open/close functionality for popup modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChangeInput = (event) => {
    setInput(event.target.value);
  }

  // setting state for Amount textfield
  const [inputAmount, setInputAmount] = useState(0);
  const handleChangeInputAmount = (event) => {
    setInputAmount(event.target.value);
  }
  // setting state for payee textfield
  const [inputPayee, setInputPayee] = useState(0);
  const handleChangeInputPayee = (event) => {
    setInputPayee(event.target.value);
  }
  
  // setting state for radio buttons
  const [selection, setSelection] = React.useState();
  const updateSelection = (event, value) => {
    setSelection(event.target.value);
  };

  // state for select menu for categories
  const [inputCategorie, setInputcategorie] = React.useState("");
  const handleChangeCategory = event => {
    setInputcategorie(event.target.value);
  };
  
  // state for datepicker
  var todayDate = new Date().toISOString().slice(0,10);
  const [inputDate, setInputDate] = React.useState(todayDate);
  const handleDateChange = event => {
    setInputDate(event.target.value);
  }
  

  const Category_id = getCategoryByName(props.categories, inputCategorie);
  const transaction_types_id = getTransactionTypeByName(props.transaction_type,selection);
  const account_id = getAccountByName(props.accounts,props.account);
  

  //handling close functionality for popup modal
  const handleClose = () => {
    setInputcategorie("")
    setOpen(false);
  };

  //function to add account to db
  const addNewCategory = () => {
    addCategory(input)
    setInput("");
    handleClose(); 
  }

  
  


  const addNewTransaction = () => {
    const data = {
      category_id:Category_id,
      account_id:account_id,
      transaction_type_id:transaction_types_id, 
      payee:inputPayee,
      amount_cents:Number(inputAmount),
      transaction_date:inputDate
    }
    addTransactions(data);
    setInputAmount("");
    setInputPayee("");
    setInputcategorie("");
    setSelection("");
    handleClose();
  }


  return (
    <React.Fragment>
      <CssBaseline />
      <Partial maxWidth="xl" className={classes.partial}>
        {/* <Dashboard /> */}
        <AccountReport 
          account={props.account}
          transactions={props.transactions}
          categories={state.categories}
        /> 
        <Button variant="outlined" color="primary" onClick={handleClickOpen} className={classes.button}>
            Add Categories
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" >
          <DialogTitle id="form-dialog-title">Add Category</DialogTitle>
          <DialogContent>
            <h3>Enter Category</h3>
            <FormControl component="fieldset" className={classes.formControl}>
              <TextField
                id="outlined-secondary"
                label=""
                variant="outlined"
                color="primary"
                onChange={handleChangeInput}
              /> 
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" className={classes.button}>
              Cancel
            </Button>
            <Button onClick={addNewCategory} color="primary" className={classes.button}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Button variant="outlined" color="primary" onClick={handleClickOpen} className={classes.button}>
            Add Transactions
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" >
        <DialogTitle id="form-dialog-title">Add Transactions</DialogTitle>
        <DialogContent>
          
          <FormControl component="fieldset" className={classes.formControl}>
            <h3>Enter Amount</h3>
            <TextField
              id="outlined-secondary"
              label="upto 2 decimals "
              variant="outlined"
              color="primary"
              onChange={handleChangeInputAmount}
            /> 
            <h3>Enter Payee</h3>
            <TextField
                id="outlined-secondary"
                label=""
                variant="outlined"
                color="primary"
                onChange={handleChangeInputPayee}
            /> 
            <h3>Select Category</h3>
            <Select
              value={inputCategorie}
              className={classes.inner}
              onChange={handleChangeCategory}
              id="select"
            >   
              {
                props.categories.map(category => (<MenuItem value={category.name}>{category.name}</MenuItem>))
              }
              
            </Select>
            
            <h3>Select Transaction Type</h3>
            <RadioGroup aria-label="gender" name="gender1"  onChange={updateSelection}>
              <FormControlLabel value="Inflow" control={<Radio />} label="Inflow" className={classes.button}/>
              <FormControlLabel value="Outflow" control={<Radio />} label="Outflow" className={classes.button} />
            </RadioGroup>

            <h4>Date</h4>
            
            <TextField
              id="date"
              label="Transaction Date"
              type="date"
              defaultValue={todayDate}
              onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" className={classes.button}>
            Cancel
          </Button>
          <Button onClick={addNewTransaction} color="primary" className={classes.button}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <TransactionTable 
        account={props.account}
        transactions={state.transactions}
        categories={props.categories}
        transaction_types={props.transaction_type}
      />
      </Partial>
    </React.Fragment>
  );
}