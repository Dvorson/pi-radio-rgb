import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import { debounce } from 'lodash';

const setVolume = debounce((volume) => fetch(`/api/setVolume?volume=${volume}`), 100);
const DEFAULT_VOLUME = 80;

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

export default function ContinuousSlider() {
  const classes = useStyles();
  const [value, setValue] = React.useState(DEFAULT_VOLUME);

  const handleChange = (event, newValue) => {
    setVolume(newValue);
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography id="continuous-slider" gutterBottom>
        Громкость
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <VolumeDown />
        </Grid>
        <Grid item xs>
          <Slider value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
        </Grid>
        <Grid item>
          <VolumeUp />
        </Grid>
      </Grid>
    </div>
  );
}