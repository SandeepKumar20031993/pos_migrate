import React, { useEffect } from 'react'
import { Box, Button, Grid } from '@material-ui/core';
import { useDispatch } from "react-redux";
import { pageTitle } from '../../../redux/action/themeAction';
import * as serviceWorker from '../../../serviceWorker';


function GeneralSettings() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitle('General Settings'));
    }, [dispatch]);

    const installApp = () => {
        serviceWorker.promptInstallAppPopup();
    }

    return (
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        Install Galla App in your system
                    </Grid>
                    <Grid item xs={9}>
                    <Button color="secondary" variant="contained" onClick={installApp}>Install</Button>
                    </Grid>
                </Grid>
            </Box>
    )
}

export default GeneralSettings
