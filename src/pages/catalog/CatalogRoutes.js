import React from 'react'
import { Route, withRouter } from 'react-router-dom';
import Product from "./Product"
import Index from "./Index"
import Category from "./Category"


const CatalogRoutes = ({ match }) => {
    return (
        <>
            <Route exact path={match.path} component={Index} />
            <Route path={`${match.path}/product`} component={Product} />
            <Route path={`${match.path}/category`} component={Category} />
        </>
    )
}

export default withRouter(CatalogRoutes)
