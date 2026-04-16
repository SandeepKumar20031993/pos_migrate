import React from 'react';

import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CachedIcon from '@material-ui/icons/Cached';
import BackupIcon from '@material-ui/icons/Backup';
import { loading } from '../../../redux/action/InterAction';
import { getProductsFromDb, clearProductData } from '../../../services/product-service';



const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        paddingLeft: '16px'
    },
    paper: {
        marginRight: theme.spacing(2),

    },
    button: {
        border: '1px solid blue',
        color: 'blue',
        padding: '2px',
    }
}));

export default function SyncMenu() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const dispatch = useDispatch()


    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const handleProductSync = () => {
        setOpen(false);
        dispatch(loading(true));
        clearProductData();

        sessionStorage.removeItem("indexdb_refreshed");
        getProductsFromDb()

        setTimeout(() => {

            dispatch(loading(false));
            // window.location.reload()

        }, 2000);
    }


    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div className={classes.root}>
            <div>
                <Button
                    // startIcon={<CloudDownloadIcon style={{ color: 'blue' }} />}
                    className={classes.button}
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                >
                    <CloudDownloadIcon style={{ color: 'blue' }} />

                </Button>
                <Popper placement='bottom-end' style={{ zIndex: 100 }} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper  >
                                <ClickAwayListener onClickAway={handleClose}>
                                    <List component={'nav'} id="menu-list-grow">
                                        <ListItem button onClick={handleProductSync}>
                                            <ListItemIcon>
                                                <CachedIcon style={{ color: 'blue' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Products Sync" />
                                        </ListItem>

                                        <ListItem button disabled>
                                            <ListItemIcon>
                                                <BackupIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Sales Sync" />
                                        </ListItem>
                                    </List>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
}

