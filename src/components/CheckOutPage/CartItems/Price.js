import React from "react";
import { Grid, Typography, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CartHelper from "../../../Helper/cartHelper";

const Styles = theme => ({
    firstamount: {
        color: '#aaaa00',
        fontSize: 15,
        fontWeight: 'bold',
    }, secondamount: {
        textDecorationLine: 'line-through',
        fontSize: 14,

    }, discountamount: {
        color: '#aaaa00',
        fontSize: 15,
        fontWeight: 'bold',
    }
});

function Price({ classes, product }) {
    const rulesAppliedData = CartHelper.getRulesAppliedData(product);
    let dicountedPrice = rulesAppliedData.price;
    const mrp = product.finalprice;
    let displayDiscountPercentage = true;

    if (CartHelper.isGiftVoucherApplicable()) {
        dicountedPrice = product.finalprice;
        displayDiscountPercentage = false;
    }

    return (
        <Grid container direction="row">
            <Grid item lg={7} md={8} sm={8} xs={8}>
                <Grid container direction="row">
                    <Box pl={2}>
                        <Typography
                            variant="subtitle1"
                            component="span"
                            className={classes.firstamount}>
                            {CartHelper.getCurrencyFormatted(dicountedPrice)}
                        </Typography>
                    </Box>
                    {parseInt(mrp) > parseInt(dicountedPrice) ? (
                        <Box pl={2}>
                            <Typography
                                variant="subtitle1"
                                component="span"
                                className={classes.secondamount}>
                                {CartHelper.getCurrencyFormatted(mrp)}
                            </Typography>
                        </Box>
                    ) : null}
                </Grid>
            </Grid>
            {rulesAppliedData.discount_label !== "" && displayDiscountPercentage ? (
                <Grid item lg={5} md={4} sm={4} xs={4}>
                    <Typography
                        variant="subtitle1"
                        component="span"
                        className={classes.discountamount}>
                        ({rulesAppliedData.discount_label})Off
                    </Typography>
                </Grid>
            ) : null}
        </Grid>
    );
}

export default withStyles(Styles)(Price);
