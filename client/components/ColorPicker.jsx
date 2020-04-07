import React from 'react';
import { HuePicker } from 'react-color';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const startRainbow = () => fetch('/api/startRainbow');
const turnLedOff = () => fetch('/api/turnOff');
const handleChangeColor = (color) => fetch(`/api/setColor/${color.hex.replace('#', '')}`);

const useStyles = makeStyles((theme) => ({
  root: {
    top: '30vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1)
    }
  },
  button: {
    display: 'block',
    margin: theme.spacing(2),
  },
  colorPicker: {
      width: '50vw'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default function ColorPicker(props) {

    const classes = useStyles();

    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12} sm={6} className={classes.colorPicker}>
                <HuePicker onChangeComplete={handleChangeColor} width='auto' />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.actions}>
                <Button className={classes.button} variant="contained" color="primary" onClick={startRainbow}>
                    Включить режим радуги
                </Button>
                <Button className={classes.button} variant="contained" color="secondary" onClick={turnLedOff}>
                    Выключить освещение
                </Button>
            </Grid>
        </Grid>
    );
}
