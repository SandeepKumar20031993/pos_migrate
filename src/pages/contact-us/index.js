import React, { Component } from 'react'
import { Box, Grid, Typography, TextField, Button, Paper } from '@material-ui/core'
import { Call, Email, Send } from '@material-ui/icons'
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { pageTitle } from '../../redux/action/themeAction';

class index extends Component {

    componentDidMount() {
        this.props.pageTitle('Contact us');
    }

    render() {
        return (
            <Box p={3} className="height-100-overflow">
                <Box p={3}>
                    <Grid container direction="row">
                        <Grid item xs>
                            <Typography component="h6" variant="h6">Let's get in touch</Typography>
                            <Typography variant="inherit" component="span" className="color-lite">Send us a message with any Question you have, about any Orders or just to Say Hi!</Typography>
                        </Grid>
                        <Grid item xs>
                            <Box className="width-100" pl={3} pt={2}>
                                <form className="width-100" autoComplete="off">
                                    <Grid container direction="row" spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Full name"
                                                variant="outlined"
                                                className="width-100"
                                                inputProps={{
                                                    className: "width-100 background-white"
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Email"
                                                variant="outlined"
                                                className="width-100"
                                                inputProps={{
                                                    className: "width-100 background-white"
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                multiline
                                                rows="4"
                                                label="Your message for us"
                                                variant="outlined"
                                                className="width-100 background-white"
                                                inputProps={{
                                                    className: "width-100 background-white"
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button variant="contained" size="large" className="width-100" color="secondary">Send your message</Button>
                                            <Box p={2}></Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Paper square={true}>
                    <Box p={3}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={4}>
                                <Box p={0} pb={1} className="display-flex">
                                    <Call className="mr-5" /><Typography variant="button" component="span">Reach us by the phone</Typography>
                                </Box>
                                <Box p={0}>
                                    <Typography variant="body1" component="span" className="color-lite">
                                        -08880824000
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box p={0} pb={1} className="display-flex">
                                    <Email className="mr-5" /><Typography variant="button" component="span">Send us an email</Typography>
                                </Box>
                                <Box p={0}>
                                    <Typography variant="body1" component="span" className="color-lite">
                                        support@treewalkerlabs.com
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box p={0} pb={1} className="display-flex">
                                    <Send className="mr-5 rotate-45" /><Typography variant="button" component="span">Send us a letter</Typography>
                                </Box>
                                <Box p={0}>
                                    <Typography variant="body1" component="span" className="color-lite">
                                        #4S, Khata No 648, Reliable Residency, Haralur Road (Opp Vibgyor School Main gate), HSR Sector-2 Extension, Bengaluru, Karnataka 560102
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        )
    }
}

index.propTypes = {
    pageTitle: PropTypes.func.isRequired,
}
// const mapStateToProps = state => ({
//     storeData: state.storeData,
// });
export default connect(null, { pageTitle })(index)
