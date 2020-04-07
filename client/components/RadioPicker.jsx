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
    padding: theme.spacing(1),
    margin: 0,
    width: 'calc(100vw - 16px)',
    height: 'calc(100vh - 60px)',
    overflowY: 'scroll'
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
  progress: {
    margin: theme.spacing(2)
  },
  actions: {
    marginBottom: theme.spacing(1)
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

    renderStation = ({ title, logo, streamUrls, i }) => {
        const { classes } = this.props;
        return (
            <Grid item xs={12} sm={4} key={i}>
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

        const { stations, classes, handleClose } = this.props;
        const isLoading = !Boolean(stations.length);

        return (
            <Fragment>
                <div className={classes.actions}>
                    <Button className={classes.button} variant="contained" color="primary" onClick={handleClose}>
                        Закрыть
                    </Button>
                </div>
                <Grid container className={classes.root} spacing={2}>
                    { isLoading ? <CircularProgress className={classes.progress} color="secondary" /> : stations.map((station, i) => this.renderStation({...station, i})) }
                </Grid>
            </Fragment>
        );
    }
}

export default withStyles(styles)(RadioPicker);
