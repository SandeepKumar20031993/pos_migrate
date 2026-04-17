import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Box, Paper, Grid, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { ArrowForwardIos } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { pageTitle } from '../../redux/action/themeAction';
import Faq from './faq';
import ContactUs from '../contact-us';

const Index = ({ pageTitle }) => {
    const [faqs, setFaqs] = useState(true);
    const [contact_us, setContact_us] = useState(false);

    useEffect(() => {
        pageTitle('Help');
    }, [pageTitle]);

    const handleFaq = () => {
        setFaqs(true);
        setContact_us(false);
    }

    const handleContactUs = () => {
        setFaqs(false);
        setContact_us(true);
    }

    return (
        <Box className="container">
            <Grid container direction="row" className="height-100">
                <Grid item xs={3} className="height-100">
                    <Paper className="height-100 no-border-radius">
                        <List component="nav">
                            <ListItem button className="padding-15" onClick={handleFaq} selected={faqs}>
                                <ListItemText primary="FAQs" />
                                <ListItemIcon>
                                    <ArrowForwardIos />
                                </ListItemIcon>
                            </ListItem>
                            <Divider />
                            <ListItem button className="padding-15" onClick={handleContactUs} selected={contact_us}>
                                <ListItemText primary="Contact" />
                                <ListItemIcon>
                                    <ArrowForwardIos />
                                </ListItemIcon>
                            </ListItem>
                            <Divider />
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={9} className="height-100">
                    {faqs ? <Faq /> : null}
                    {contact_us ? <ContactUs /> : null}
                </Grid>
            </Grid>
        </Box>
    )
}

Index.propTypes = {
    pageTitle: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    storeData: state.storeData,
});
export default connect(mapStateToProps, { pageTitle })(withRouter(Index))

