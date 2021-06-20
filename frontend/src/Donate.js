import { makeStyles, Modal } from '@material-ui/core';
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import PaymentIcon from '@material-ui/icons/Payment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    '& h1': {
      position: 'relative',
      left: '84%',
      transform: 'translate(-50%, -50%)',
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    margin: '10px',
    padding: theme.spacing(0.6),
    // width: '100px',
    '&:active': {
      outline: 'none',
    },
  },
}));

// payment integration
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function Donate() {
  const [amount, setAmount] = useState();

  async function showRzp(e) {
    e.preventDefault();
    console.log(amount);

    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );

    if (!res) {
      alert('Error!');
      console.log('razorpay sdk script load fail');
    }

    const data = await fetch('https://pay-int.herokuapp.com/pay', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100,
      }),
    }).then((res) => res.json());
    console.log('order aa gaya idhar bhi...', data);

    const options = {
      key: 'rzp_test_B5fDUEmAoVkNDc',
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      name: 'The Sparks Foundation',
      description: 'Test Transaction',
      image: 'https://pay-int.herokuapp.com/logo.png',
      handler: function (response) {
        alert('payment successful');
        console.log(response.razorpay_payment_id);
        console.log(response.razorpay_order_id);
        console.log(response.razorpay_signature);
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    setOpen(false);
  }

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <div className='donate'>
      <Modal
        className={classes.modal}
        open={open}
        onClose={(e) => setOpen(false)}
      >
        <form className={classes.paper}>
          <h1>Donation</h1>
          <input
            className={classes.input}
            type='text'
            placeholder='Enter Amount'
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            required
          />
          <Button
            variant='contained'
            color='secondary'
            className={classes.button}
            onClick={showRzp}
            startIcon={<PaymentIcon />}
          >
            Proceed To Pay
          </Button>
        </form>
      </Modal>
      <Button
        variant='contained'
        color='primary'
        size='small'
        onClick={(e) => setOpen(true)}
        className={classes.button}
        endIcon={<AttachMoneyIcon />}
      >
        Donate
      </Button>
    </div>
  );
}

export default Donate;
