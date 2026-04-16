import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
//import ProductPannel from '../../components/ProductPage/ProductPannel';
//import SelectPannel from '../../components/ProductPage/SelectedProduct'
import LeftPanel from '../../components/newhome/leftpanel'
import RightPanel from '../../components/newhome/rightpanel'
import Helper from '../../Helper/storeHelper'
import { connect } from "react-redux";
import { pageTitle } from '../../redux/action/themeAction';
import PropTypes from 'prop-types';
import CartHelper from '../../Helper/cartHelper';
import BottomPanel from '../../components/newhome/bottompanel';


class newhome extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount() {
        if (CartHelper.isEmpty(this.props.returnData) && !this.props.returnData.success) {
            this.props.pageTitle('New Sale');
        }
    }

    render() {
        const isLoggedIn = Helper.isLoggedIn();
        return (
            <>
                {isLoggedIn ?
                    <Grid container className="new-home">
                        <Grid item xs={12} sm className="new-home-left">
                            <LeftPanel />
                        </Grid>
                        <Grid item xs={12} sm={4} className="new-home-right">
                            <RightPanel />
                        </Grid>
                        <Grid item xs={12}>
                            <BottomPanel />
                        </Grid>
                    </Grid>
                    : null
                }
            </>
        )
    }
}
newhome.propTypes = {
    pageTitle: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    returnData: state.returnData,
});
export default connect(mapStateToProps, { pageTitle })(newhome)
