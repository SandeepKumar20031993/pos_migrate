import React from 'react'
import { TableCell, TableRow } from '@material-ui/core';
import CartHelper from '../../Helper/cartHelper'

const ReturnProductList = ({ product }) => {
    const price = CartHelper.getPrice(product)
    const taxAmount = CartHelper.getTaxAmount(product.price, product)
    const rowTotal = CartHelper.calculateTax(price, product)
    const formattedPrice = CartHelper.getCurrencyFormatted(Number(price).toFixed(2))
    const formattedTax = CartHelper.getCurrencyFormatted(Number(taxAmount).toFixed(2))
    const formattedRowTotal = CartHelper.getCurrencyFormatted(Number(rowTotal * product.qty).toFixed(2))
    
    return (
        <TableRow>
            <TableCell variant="footer" component="th" scope="row">
                {product.name}
            </TableCell>
            <TableCell variant="footer" align="right">{product.barcode}</TableCell>
            <TableCell variant="footer" align="right">{Math.round(product.qty)}</TableCell>
            <TableCell variant="footer" align="right">{formattedPrice}</TableCell>
            <TableCell variant="footer" align="right">{formattedTax}</TableCell>
            <TableCell variant="footer" align="right">{formattedRowTotal}</TableCell>
        </TableRow>
    )
}

export default ReturnProductList
