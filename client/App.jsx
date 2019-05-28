import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Modal from '@material-ui/core/Modal';
import { CirclePicker } from 'react-color';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4),
  },
  container: {
    backgroundColor: theme.palette.background.default,
    height: '99vh'
  },
  paper: {
    position: 'absolute',
    width: '80vw',
    top: '10vh',
    left: '10vw',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  button: {
    display: 'block',
    margin: theme.spacing(2),
  },
  header: {
    maxWidth: '100%',
    margin: '16px 0'
  }
}));

export default function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const startRainbow = () => fetch('/api/startRainbow');
  const turnLedOff = () => fetch('/api/turnOff');
  const handleChangeColor = (color) => fetch(`/api/setColor/${color.hex.replace('#', '')}`);
  return (
    <Container className={classes.container}>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={3}>
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

        <Grid item xs={3}>
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

        <Grid item xs={3}>
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

        <Grid item xs={3}>
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

        <Grid item xs={3}>
          <Card className={classes.card} onClick={handleOpen}>
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

        <Grid item xs={3}>
          <Card className={classes.card}>
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

        <Grid item xs={3}>
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

      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div className={classes.paper}>
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={6}>
                    <CirclePicker onChangeComplete={ handleChangeColor } />
                </Grid>
                <Grid item xs={6}>
                    <Button className={classes.button} variant="contained" color="primary" onClick={startRainbow}>
                        Включить режим радуги
                    </Button>
                    <Button className={classes.button} variant="contained" color="secondary" onClick={turnLedOff}>
                        Выключить освещение
                    </Button>
                </Grid>
            </Grid>
        </div>
      </Modal>

    </Container>
  );
}
