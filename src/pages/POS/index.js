import React, { Component } from 'react'
import StoreHelper from "../../Helper/storeHelper"
import DefaultHome from "./home"
import GroceryLayout from "./grocery"

export class index extends Component {
    render() {
        const pos_layout = StoreHelper.getPosLayout();
        
        return (
            <>
                {pos_layout === "default" ?
                    <>
                        <DefaultHome />
                    </>
                    : null}
                {pos_layout === "grocery" ?
                    <>
                        <GroceryLayout />
                    </>
                    : null}
            </>

        )
    }
}

export default index
