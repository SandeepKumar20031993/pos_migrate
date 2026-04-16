import React, { Component } from 'react'
import { Box, Typography } from '@material-ui/core';
import { connect } from "react-redux";
import CartHelper from '../../../Helper/cartHelper'

class ReturnDetails extends Component {

  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
  }

  getOldInvoiceProducts = () => {
    var product = [];
    const { returnData } = this.props;
    if (!CartHelper.isEmpty(returnData)) {
      product = returnData.data
    }
    return product;
  }

  getNewInvoiceProducts = () => {
    var product = [];
    const checkoutData = CartHelper.getCheckoutData();
    var billingData = checkoutData.billingData
    if (!CartHelper.isEmpty(billingData)) {
      product = billingData.data
    }
    return product;
  }

  getReturnedProducts = () => {
    var oldProductList = this.getOldInvoiceProducts();
    var notExisted = [];
    oldProductList.forEach(oldProduct => {
      if (!this.isExist(oldProduct)) {
        notExisted.push(oldProduct);
      }
    })
    return notExisted;
  }

  isExist = (product) => {
    var isExist = false
    var newProductList = this.getNewInvoiceProducts();
    newProductList.forEach(newProduct => {
      if (newProduct.barcode === product.barcode) {
        isExist = true
      }
    });
    return isExist
  }

  isChanged = (product) => {
    var isChanged = false
    var newProductList = this.getNewInvoiceProducts();
    newProductList.forEach(newProduct => {
      if (newProduct.barcode === product.barcode && newProduct.qty !== product.qty) {
        isChanged = true
      }
    });
    return isChanged
  }

  render() {
    const ReturnedProduct = this.getReturnedProducts();
    return (
      <>
        {ReturnedProduct && ReturnedProduct.length > 0 ?
          <Box p={0} className="align-left background-white">
            <Box pb={0}>
              <Typography className="custom-font" variant="body2" component="p">{"Return Product Details"}</Typography>
            </Box>
            <table className="inv-table" colSpan={12}>
              <tbody>
                {/* <tr className="inv-table-row">
                  <th className="inv-table-data-left" colSpan={3}>
                    <Typography className="custom-font" variant="body2" component="p">{"Name"}</Typography>
                  </th>
                  <th className="inv-table-data-left" colSpan={3}>
                    <Typography className="custom-font" variant="body2" component="p">{"Qty"}</Typography>
                  </th>
                </tr> */}
                {ReturnedProduct.map((product, index) => (
                  <tr className="inv-table-row" key={index}>
                    <td className="inv-table-data-left" colSpan={3}>
                      <Typography className="custom-font" variant="body2" component="p">{product.name}</Typography>
                    </td>
                    {/* <td className="inv-table-data-left" colSpan={3}>
                      <Typography className="custom-font" variant="body2" component="p">{product.qty}</Typography>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          : null}
      </>
    )
  }
}
const mapStateToProps = state => ({
  checkoutData: state.checkoutData,
  returnData: state.returnData,
});
export default connect(mapStateToProps, null)(ReturnDetails);
