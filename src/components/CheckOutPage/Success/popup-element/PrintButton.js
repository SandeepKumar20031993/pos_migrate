import React, { useEffect, useRef } from "react"
import { Box, Button } from "@material-ui/core"
import { useSelector } from "react-redux";
//import PropTypes from "prop-types";
import ReactToPrint from "react-to-print";
import PrintBill from "../../Print/PrintBill";
import CartHelper from "../../../../Helper/cartHelper"


function PrintButton() {
    const checkoutData = useSelector((state) => state.checkoutData)
    const buttonRef = useRef(null)
    const componentRef = useRef(null)

    useEffect(() => {
        buttonRef.current?.click()
    }, [])

    return (
        <Box>
            <ReactToPrint
                trigger={() => <Button ref={buttonRef} variant="contained" color="secondary" className={'success-page-button print-button'} disabled={CartHelper.isEmpty(checkoutData.billingData)}>PRINT</Button>}
                content={() => componentRef.current}
            />
            <div style={{ display: "none" }}><PrintBill ref={componentRef} /></div>
        </Box>
    )
}

export default PrintButton;
