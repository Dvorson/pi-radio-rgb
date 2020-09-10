import React, { Fragment } from 'react';
import { HuePicker } from 'react-color';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const startRainbow = () => fetch('/api/startRainbow');
const turnLedOff = () => fetch('/api/turnOff');
const handleChangeColor = (color) => fetch(`/api/setColor/${color.hex.replace('#', '')}`);

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
    margin: 0,
    width: 'calc(100vw - 16px)',
    height: 'calc(100vh - 60px)',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1)
    }
  },
  colorPicker: {
    width: '80vw',
    margin: '10vh'
  },
  actions: {
    marginBottom: theme.spacing(1)
  },
  button: {
    display: 'block',
    margin: 'auto'
  }
}));

export default function ColorPicker({ handleClose }) {

  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.actions}>
        <Button variant="contained" color="primary" onClick={handleClose}>
          Закрыть
        </Button>
      </div>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12} sm={12} className={classes.colorPicker}>
          <HuePicker onChangeComplete={handleChangeColor} width='auto' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button className={classes.button} variant="contained" color="primary" onClick={startRainbow}>
            Включить режим радуги
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button className={classes.button} variant="contained" color="secondary" onClick={turnLedOff}>
            Выключить освещение
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
}
