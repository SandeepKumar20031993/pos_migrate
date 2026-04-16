import React, { Component } from 'react'
import { Box, Paper, Grid, Typography, Button, TextField } from '@material-ui/core';
import { Info } from '@material-ui/icons';

import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { pageTitle } from '../../redux/action/themeAction';

class faq extends Component {
    componentDidMount() {
        this.props.pageTitle('FAQs');
    }

    render() {
        return (
            <Box className="height-100-overflow">
                <Paper square={true} >
                    <Grid container direction="row" justify="center">
                        <Grid item>
                            <Box p={3} pb={0}>
                                <Typography variant="h4" component="h1">FAQ</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justify="center">
                        <Grid item>
                            <Box p={0} pb={3}>
                                <Typography variant="h6" component="h6">Search our FAQs or browse by category below</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justify="center">
                        <Grid item xs={8}>
                            <Box p={0} pb={3}>
                                <Grid container item xs={12} direction="row" justify="center">
                                    <Grid item xs={10}>
                                        <TextField
                                            type="text"
                                            placeholder="How do we help?"
                                            variant="outlined"
                                            className="background-white no-border-radius width-100"
                                            inputProps={{
                                                className: "padding-9"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button variant="outlined" className="background-black no-border-radius">Search</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                <Box p={2}>
                    <Grid container direction="row">
                        <Grid item>
                            <Box>
                                <Typography variant="h6" component="h6">FAQs</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={2}>
                        <Grid item xs={6}>
                            <Box>
                                <Typography variant="subtitle1" component="h6">Getting started</Typography>
                            </Box>

                            <Box pb={1}>
                                <Paper square={true}>
                                    <Box p={1}>
                                        <Grid container justify="flex-start" spacing={1}>
                                            <Grid item>
                                                <Info color="secondary" />
                                            </Grid>
                                            <Grid item xs>
                                                <Typography variant="body1" component="h6">Which language are supported</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Box>
                            <Box pb={1}>
                                <Paper square={true}>
                                    <Box p={1}>
                                        <Grid container justify="flex-start" spacing={1}>
                                            <Grid item>
                                                <Info color="secondary" />
                                            </Grid>
                                            <Grid item xs>
                                                <Typography variant="body1" component="h6">Which language are supported</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Box>
                            <Box pb={1}>
                                <Paper square={true}>
                                    <Box p={1}>
                                        <Grid container justify="flex-start" spacing={1}>
                                            <Grid item>
                                                <Info color="secondary" />
                                            </Grid>
                                            <Grid item xs>
                                                <Typography variant="body1" component="h6">Which language are supported</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <Typography variant="subtitle1" component="h6">Getting started</Typography>
                            </Box>

                            <Box pb={1}>
                                <Paper square={true}>
                                    <Box p={1}>
                                        <Grid container justify="flex-start" spacing={1}>
                                            <Grid item>
                                                <Info color="secondary" />
                                            </Grid>
                                            <Grid item xs>
                                                <Typography variant="body1" component="h6">Which language are supported</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Box>
                            <Box pb={1}>
                                <Paper square={true}>
                                    <Box p={1}>
                                        <Grid container justify="flex-start" spacing={1}>
                                            <Grid item>
                                                <Info color="secondary" />
                                            </Grid>
                                            <Grid item xs>
                                                <Typography variant="body1" component="h6">Which language are supported</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Box>
                            <Box pb={1}>
                                <Paper square={true}>
                                    <Box p={1}>
                                        <Grid container justify="flex-start" spacing={1}>
                                            <Grid item>
                                                <Info color="secondary" />
                                            </Grid>
                                            <Grid item xs>
                                                <Typography variant="body1" component="h6">Which language are supported</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

            </Box>
        )
    }
}
faq.propTypes = {
    pageTitle: PropTypes.func.isRequired,
}
// const mapStateToProps = state => ({
//     storeData: state.storeData,
// });
export default connect(null, { pageTitle })(faq)