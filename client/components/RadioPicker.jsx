import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';

const playStream = (streamUrl) => fetch('/api/playStream', {
    method: 'POST',
    body: JSON.stringify({ streamUrl }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
}).then(res => res.json());

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4),
  },
  media: {
      height: '15vh'
  },
  title: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '1rem'
  },
  button: {
      margin: '0 0 20px -8px'
  },
  progress: {
    margin: theme.spacing(2)
  }
});

class RadioPicker extends React.Component {

    handleSelect = (streamUrls, title) => () => {
        playStream(streamUrls[0].streamUrl);
        this.props.onPickRadio(title);
    }

    handleStationsUpdate = () => {
        this.props.onUpdateStations();
    }

    renderStation = ({ title, logo, streamUrls }) => {
        const { classes } = this.props;
        return (
            <Grid item xs={4}>
                <Card className={classes.card} onClick={this.handleSelect(streamUrls, title)}>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image={logo}
                            title={title}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
                                {title}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    }

    render() {

        const { stations, classes } = this.props;
        const isLoading = !Boolean(stations.length);

        return (
            <Fragment>
                <Button className={classes.button} variant="contained" color="primary" onClick={this.handleStationsUpdate}>
                    Обновить список станций
                </Button>
                <Grid container className={classes.root} spacing={2}>
                    { isLoading ? <CircularProgress className={classes.progress} color="secondary" /> : stations.map(station => this.renderStation(station)) }
                </Grid>
            </Fragment>
        );
    }
}

export default withStyles(styles)(RadioPicker);
