import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Box, Paper, Grid, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { ArrowForwardIos } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { pageTitle } from '../../redux/action/themeAction';
import Faq from './faq';
import ContactUs from '../contact-us';

class index extends Component {
    constructor(props) {
        super(props)

        this.state = {
            faqs: true,
            contact_us: false
        }
    }

    componentDidMount() {
        this.props.pageTitle('Help')
    }
    handleFaq = () => {
        this.setState({
            faqs: true,
            contact_us: false
        })
    }
    handleContactUs = () => {
        this.setState({
            faqs: false,
            contact_us: true
        })
    }


    render() {
        const { faqs, contact_us } = this.state
        return (
            <Box className="container">
                <Grid container direction="row" className="height-100">
                    <Grid item xs={3} className="height-100">
                        <Paper className="height-100 no-border-radius">
                            <List component="nav">
                                <ListItem button className="padding-15" onClick={this.handleFaq} selected={faqs}>
                                    <ListItemText primary="FAQs" />
                                    <ListItemIcon>
                                        <ArrowForwardIos />
                                    </ListItemIcon>
                                </ListItem>
                                <Divider />
                                <ListItem button className="padding-15" onClick={this.handleContactUs} selected={contact_us}>
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
}

index.propTypes = {
    pageTitle: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    storeData: state.storeData,
});
export default connect(mapStateToProps, { pageTitle })(withRouter(index))

