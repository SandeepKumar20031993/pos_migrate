import React, { Component } from 'react'
import { TableCell, TableRow } from '@material-ui/core';
import CartHelper from '../../Helper/cartHelper'

export class productList extends Component {
    render() {
        const { product } = this.props
        var price = CartHelper.getPrice(product)
        var taxAmount = CartHelper.getTaxAmount(product.price, product)
        var rowTotal = CartHelper.calculateTax(price, product)
        var formattedPrice = CartHelper.getCurrencyFormatted(Number(price).toFixed(2))
        var formattedTax = CartHelper.getCurrencyFormatted(Number(taxAmount).toFixed(2))
        var formattedRowTotal = CartHelper.getCurrencyFormatted(Number(rowTotal * product.qty).toFixed(2))
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
}

export default productList
