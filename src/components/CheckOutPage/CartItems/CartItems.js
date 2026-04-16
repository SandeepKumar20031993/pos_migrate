import React from "react";
import TableList from "./CartItems/TableList";
import GridList from "./CartItems/GridList";

export function CartItem({ view }) {
    return (
        <>
            {view === "gridList" ? <GridList /> : null}
            {view === "table" ? <TableList /> : null}
        </>
    );
}

export default CartItem;
