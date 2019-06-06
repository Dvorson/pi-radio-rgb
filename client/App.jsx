import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

import ModalContainer from './components/Modal';
import ColorPicker from './components/ColorPicker';
import RadioPicker from './components/RadioPicker';

const getStations = () => fetch('/api/getRadioStations').then(res => res.json());
const turnRadioOff = () => fetch('/api/stopPlay');

const styles = (theme) => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: '19vh'
  },
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4),
  },
  container: {
    backgroundColor: theme.palette.background.default,
    height: '99vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  button: {
    display: 'block',
    margin: theme.spacing(2),
  },
  header: {
    maxWidth: '100%',
    margin: '16px 0'
  }
});

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isColorModalOpen: false,
      isRadioModalOpen: false,
      isSnackBarOpen: false,
      snackBarMessage: '',
      stations: []
    }
  }

  componentDidMount() {
    getStations().then(stations => this.setState({ stations }));
  }

  handleColorModalOpen = () => this.setState({ isColorModalOpen: true })

  handleColorModalClose = () => this.setState({ isColorModalOpen: false })

  handleRadioModalOpen = () => this.setState({ isRadioModalOpen: true })

  handleRadioModalClose = () => this.setState({ isRadioModalOpen: false })

  handleRadioSelect = (stationName) => this.setState({
    isSnackBarOpen: true,
    snackBarMessage: `Сейчас играет: ${stationName}`
  })

  handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ isSnackBarOpen: false });
    turnRadioOff();
  }

  render() {

    const {
      props,
      state,
      handleColorModalClose,
      handleColorModalOpen,
      handleRadioModalClose,
      handleRadioModalOpen,
      handleRadioSelect,
      handleSnackBarClose
    } = this;
    const { classes } = props;
    const {
      isColorModalOpen,
      isRadioModalOpen,
      isSnackBarOpen,
      snackBarMessage,
      stations
    } = state;
    
    return (
      <Container className={classes.container}>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12} sm={3}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="/static/img/Прозрачный-океан.jpg"
                  title="Ocean"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Океан
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="/static/img/Кения-сафари-в-Африке.jpg"
                  title="Africa"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Африка
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="/static/img/166368.jpg"
                  title="Desert"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Пустыня
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="/static/img/1504605947158114655.jpg"
                  title="Forest"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Лес
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>

        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card className={classes.card} onClick={handleColorModalOpen}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="/static/img/200px-Color_circle_(hue-sat).png"
                  title="Color"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Свет
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card className={classes.card} onClick={handleRadioModalOpen}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="/static/img/icon.png"
                  title="Radio"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Радио
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="/static/img/yt_1200-vfl4C3T0K.png"
                  title="YouTube"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    YouTube
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

        </Grid>

        <ModalContainer open={isColorModalOpen} handleClose={handleColorModalClose}>
          <ColorPicker/>
        </ModalContainer>

        <ModalContainer open={isRadioModalOpen} handleClose={handleRadioModalClose}>
          <RadioPicker stations={stations} onPickRadio={handleRadioSelect}/>
        </ModalContainer>

        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isSnackBarOpen}
          onClose={handleSnackBarClose}
          TransitionComponent={Slide}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{ snackBarMessage }</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={handleSnackBarClose}>
              Выключить
            </Button>
          ]}
        />

      </Container>
    );
  }
}

export default withStyles(styles)(App);
