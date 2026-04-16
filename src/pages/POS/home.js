import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import ProductPannel from '../../components/ProductPage/ProductPannel';
import SelectPannel from '../../components/ProductPage/SelectedProduct'
import Helper from '../../Helper/storeHelper'
import { connect } from "react-redux";
import { pageTitle } from '../../redux/action/themeAction';
import PropTypes from 'prop-types';
import CartHelper from '../../Helper/cartHelper';
import Header from '../../components/theme/header';


class home extends Component {
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
        const { loading: fetchingProducts } = this.props.interAction
        return (
            <>
                {Helper.isLoggedIn() ?
                    <Grid container >
                        <Grid item lg={8} md={8} sm={8} xs={12}>
                            {/* <Header /> */}
                            {fetchingProducts ? 'Loading' :
                                <ProductPannel />
                            }
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                            <SelectPannel />
                        </Grid>
                    </Grid>
                    : null
                }
            </>
        )
    }
}
home.propTypes = {
    pageTitle: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    returnData: state.returnData,
    interAction: state.interAction
});
export default connect(mapStateToProps, { pageTitle })(home)
