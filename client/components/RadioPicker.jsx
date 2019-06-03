import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/styles';

import Player from './Player';

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
    textOverflow: 'ellipsis'
  }
});

class RadioPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            streamUrls: [],
            isLoading: true
        };
    }

    handleSelect = (streamUrls) => () => {
        // this.setState({ isPlaying: false });
        // setTimeout(() => this.setState({ isPlaying: true, streamUrls }), 0);
        playStream(streamUrls[0].streamUrl);
    }

    renderStation = ({ title, logo, streamUrls }) => {
        const { classes } = this.props;
        return (
            <Grid item xs={4}>
                <Card className={classes.card} onClick={this.handleSelect(streamUrls)}>
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
        const { isPlaying, streamUrls } = this.state;
        const isLoading = !Boolean(stations.length);

        return (
            <Grid container className={classes.root} spacing={2}>
                { isLoading ? <CircularProgress /> : stations.map(station => this.renderStation(station)) }
                { isPlaying && <Player streamUrls={streamUrls} /> }
            </Grid>
        );
    }
}

export default withStyles(styles)(RadioPicker);
