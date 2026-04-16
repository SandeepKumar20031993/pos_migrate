import React, { Component } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
//import API from '../Utility/Api';
import {
  Grid,
  CardContent,
  Card,
  CardActionArea,
  CardMedia,
  IconButton,
} from "@material-ui/core";
//import {KeyboardArrowLeft,KeyboardArrowRight} from '@material-ui/icons';
import cartHelper from "../../Helper/cartHelper";
import storeHelper from "../../Helper/storeHelper";
import { Alert } from "@material-ui/lab";
import { GridCloseIcon } from "@material-ui/data-grid";
import { getSessionValue } from "../../Helper/sessionStorage";
import { connect } from "react-redux";

const Styles = (theme) => ({
  card: {
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #f2f2f2",
    borderRadius: "6px",
    backgroundColor: "white",
    maxWidth: "240px",
    boxShadow: "0 0 15px 15px #F9F9F9",

    display: "-webkit-box",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": 2,
    // overflow: 'hidden',

    "&:hover": {
      border: "1px solid #727272",
      // boxShadow: '0 0 5px 10px #f2f2f2'
    },
  },
  media: {
    width: 120,
    height: 80,
    backgroundSize: "contain",
    marginBottom: 6,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  avatar: {
    fontSize: 14,
    background: "#f60808",
    width: 35,
    height: 35,
    fontWeight: "bold",
    position: "absolute",
    right: 16,
    top: 14,
  },
  cardcontent: {
    paddingbottom: 2,
  },
  CardActionArea: {
    minHeight: 190,
    padding: 2,
    "&:hover": {
      // backgroundColor: '#f2f2f2'
    },
  },
});

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responsive: {
        largeDesktop: {
          breakpoint: { max: 4000, min: 1368 },
          items: 5,
          slidesToSlide: 5,
        },
        desktop: {
          breakpoint: { max: 1367, min: 1024 },
          items: 4,
          slidesToSlide: 4, // optional, default to 1.
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 3,
          slidesToSlide: 3, // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
          slidesToSlide: 1, // optional, default to 1.
        },
      },
      Customdata: [],
      selectdata: [],
      multirows: false,
      outOfStockMessage: "",
    };
  }

  componentDidMount() {
    if (this.props.multirows !== undefined && this.props.multirows) {
      var i = 0;
      var multirowsItems = [];
      var items = [];
      this.props.products.forEach((product, index) => {
        if (i === 0) {
          multirowsItems.push(items);
        }
        items[i] = product;
        ++i;
        if (items.length === this.props.row) {
          items = [];
          i = 0;
        }
      });

      this.setState({
        multirows: true,
        Customdata: multirowsItems,
      });
    } else {
      this.setState({
        Customdata: this.props.products,
      });
    }
  }

  productData = (data) => {
    this.props.AddToCart(data);
  };

  showAlert = (message) => {
    this.setState({ outOfStockMessage: message });
  };

  closeAlert = () => {
    this.setState({ outOfStockMessage: "" });
  };

  getDataForCarousel = () => {
    var carouselData = {};
    if (this.props.multirows !== undefined && this.props.multirows) {
      var i = 0;
      var multirowsItems = [];
      var items = [];
      this.props.products.forEach((product, index) => {
        if (i === 0) {
          multirowsItems.push(items);
        }
        items[i] = product;
        ++i;
        if (items.length === this.props.row) {
          items = [];
          i = 0;
        }
      });

      carouselData.multirows = true;
      carouselData.Customdata = multirowsItems;

      // this.setState({
      //   multirows:true,
      //   Customdata:multirowsItems
      // })
    } else {
      carouselData.multirows = false;
      carouselData.Customdata = this.props.products;
    }
    return carouselData;
  };

  render() {
    const { classes, title, AddToCart, cartProduct } = this.props;
    //const { Customdata,multirows } = this.state;
    var carouselData = this.getDataForCarousel();
    var Customdata = carouselData.Customdata;
    var multirows = carouselData.multirows;

    return (
      <>
        {Customdata !== undefined && Customdata.length !== 0 ? (
          <div>
            {this.state.outOfStockMessage && (
              <div className="out-of-stock-overlay">
                <Alert
                  severity="error"
                  style={{ fontSize: "18px" }}
                  autoHideDuration={6000}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="large"
                      onClick={this.closeAlert}
                    >
                      <GridCloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {this.state.outOfStockMessage}
                </Alert>
              </div>
            )}
            {title ? (
              <Box pl={1} pr={1} pt={2}>
                <Typography
                  p={1}
                  component="span"
                  variant="h6"
                  display="block"
                  align="left"
                >
                  {title}
                </Typography>
              </Box>
            ) : null}
            <Carousel
              dditionalTransfrom={10000}
              arrows
              autoPlaySpeed={1000}
              centerMode={false}
              containerClass="carousel-container"
              draggable={true}
              deviceType={this.props.deviceType}
              dotListClass="custom-dot-list-style"
              focusOnSelect={false}
              infinite={false}
              itemClass="carousel-item-padding-40-px"
              minimumTouchDrag={80}
              keyBoardControl
              transitionTime={600}
              transitionDuration={100}
              renderDotsOutside={false}
              removeArrowOnDeviceType={["tablet", "mobile"]}
              responsive={this.state.responsive}
            //customLeftArrow={<KeyboardArrowLeft />}
            //customRightArrow={<KeyboardArrowRight />}
            >
              {Customdata.map((data, index) => (
                <Box key={index + "cus" + Math.random()} p={1}>
                  {multirows ? (
                    data.map((two_rows_data, index) => (
                      <ProductCard
                        AddToCart={AddToCart}
                        showAlert={this.showAlert}
                        cartProduct={cartProduct}
                        classes={classes}
                        data={two_rows_data}
                        key={"pro-card" + index + Math.random() + "product"}
                      />
                    ))
                  ) : (
                    <ProductCard
                      AddToCart={AddToCart}
                      showAlert={this.showAlert}
                      classes={classes}
                      cartProduct={cartProduct}
                      data={data}
                      key={Math.random() + "product"}
                    />
                  )}
                </Box>
              ))}
            </Carousel>
          </div>
        ) : null}
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  cartProduct: state.cartProduct,
});
export default connect(mapStateToProps)(withStyles(Styles)(ProductPage));

const ProductCard = ({ data, AddToCart, classes, showAlert, cartProduct }) => {
  const productData = (data) => {
    var loc = storeHelper.getLocationName();
    let invTracking = getSessionValue("configs_show_outofstock_in_pos");

    // Ensure invTracking is treated as a boolean or checked against "1"
    const isTrackingEnabled = invTracking === true || invTracking === "1" || invTracking === "true";

    if (isTrackingEnabled) {
      let stockForLocation = data?.stock?.find(
        (stock) => stock.location_name === loc
      );

      let availableQty = stockForLocation ? stockForLocation.quantity : 0;
      let cartItem = cartProduct.find((item) => item.id === data.id);

      // Current quantity in cart + 1 (the one being added now)
      let cartQty = cartItem ? cartItem.qty + 1 : 1;

      if (cartQty > availableQty) {
        showAlert(
          `Out of stock! Available quantity for ${loc}: ${availableQty}`
        );
        return;
      }
    }

    AddToCart(data);
  };

  return (
    <Card className={classes.card} elevation={0}>
      <CardActionArea
        onClick={() => {
          productData(data);
        }}
        className={classes.CardActionArea}
      >
        <Box
          container
          direction="row"
          display={"flex"}
          justifyContent="center"
          alignItems="center"
        >
          {data.item_image ? (
            <CardMedia
              className={classes.media}
              image={data.item_image}
              title={data.name}
            />
          ) : (
            <CardMedia
              className={classes.media}
              image={`${process.env.PUBLIC_URL}/assets/images/shop-placeholder.png`}
              title={data.name}
            />
          )}
          {/* <Grid item xs={2}>
          <Avatar aria-label="recipe" className={classes.avatar}>
          {data.discount}%
          </Avatar>
        </Grid> */}
        </Box>
        <CardContent className="padding-0">
          <Grid container direction="row" className={classes.cardcontent}>
            <Grid item xs={12}>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                color="textSecondary"
                align="center"
                className="font-weight-900"
              >
                {data.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                color="textSecondary"
                align="center"
              >
                {data.barcode}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                color="error"
                variant="subtitle2"
                style={{ textDecoration: "line-through", marginRight: "8px" }}
                display="block"
                gutterBottom
                align="center"
                component={"span"}
              >
                {cartHelper.isPriceVarient(data) &&
                  cartHelper.isPriceVarient(data)}
              </Typography>

              <Typography
                variant="subtitle1"
                display="block"
                gutterBottom
                align="center"
              >
                {cartHelper.getPriceFromPrices(data)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
