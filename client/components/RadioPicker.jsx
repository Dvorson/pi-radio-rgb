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

const getStations = () => fetch('/api/getRadioStations').then(res => res.json());

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4),
  },
  media: {
      height: '175px'
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
            stations: [],
            isPlaying: false,
            streamUrl: '',
            isLoading: true
        };
    }

    componentDidMount() {
        getStations()
            .then(stations => this.setState({ stations, isLoading: false }));
    }

    handleSelect = (streamUrl) => () => {
        this.setState({ isPlaying: false });
        setTimeout(() => this.setState({ isPlaying: true, streamUrl }), 0);
    }

    renderStation = ({ title, logo, streamUrls: [stream] }) => {
        const { classes } = this.props;
        return (
            <Grid item xs={3}>
                <Card className={classes.card} onClick={this.handleSelect(stream.streamUrl)}>
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

        const { classes } = this.props;
        const { stations, isPlaying, streamUrl, isLoading } = this.state;

        return (
            <Grid container className={classes.root} spacing={2}>
                { isLoading ? <CircularProgress /> : stations.map(station => this.renderStation(station)) }
                { isPlaying && <Player streamUrl={streamUrl} /> }
            </Grid>
        );
    }
}

export default withStyles(styles)(RadioPicker);
