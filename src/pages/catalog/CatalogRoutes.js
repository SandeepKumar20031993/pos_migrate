import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom';
import Product from "./Product"
import Index from "./Index"
import Category from "./Category"


export class CatalogRoutes extends Component {
    render() {
        return (
            <>
                <Route exact path={this.props.match.path} component={Index} />
                <Route path={`${this.props.match.path}/product`} component={Product} />
                <Route path={`${this.props.match.path}/category`} component={Category} />
            </>
        )
    }
}

export default withRouter(CatalogRoutes)
