import React from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: '80vw',
      maxHeight: '80vh',
      top: '10vh',
      left: '10vw',
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4),
      outline: 'none',
      overflowY: 'scroll'
    }
}));

export default function ModalContainer(props) {

    const { open, handleClose, children } = props;
    const classes = useStyles();

    return (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
        >
            <div className={classes.paper}>
                {children}
            </div>
        </Modal>
    )
}
