import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Grid, Button, Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core'
import { ExpandMore, CheckCircle } from '@material-ui/icons'
import { saveCategoryProducts, saveBestsellingProducts, saveRecommendedProducts, saveCategories } from '../../redux/action/productsAction';
import { loading, alert } from '../../redux/action/InterAction';
import { dbProductsData } from '../../services/product-service';

export class CategoryList extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isActive: 'all',
            activeCategory: 'ALL CATEGORY',
            expanded: false,
        }
    }
    componentDidMount() {
        var interval = setInterval(() => {
            var products = dbProductsData.data
            if (products === undefined || products.length === 0) {
                //do nothing
            } else {
                this.props.saveCategories(products);
                clearInterval(interval);
            }
        }, 500)
    }

    handleCategoryFilterBtn = (category) => {
        var products = dbProductsData.data
        if (category === 'all') {
            var categoryProducts = products.slice(0, 40);
            this.props.saveCategoryProducts(categoryProducts);
            this.setState({
                isActive: 'all',
                activeCategory: 'ALL CATEGORY',
                expanded: false
            })
        } else {
            var filteredProducts = products.filter(prod => prod.category_id === category.id);
            this.props.saveCategoryProducts(filteredProducts);
            this.setState({
                isActive: category.id,
                activeCategory: category.name,
                expanded: false
            })
        }
    }

    handleExpand = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    render() {
        const { isActive, expanded, activeCategory } = this.state
        const { productData } = this.props
        const { categories } = productData
        var totalCount = categories.length
        var visibleCat = categories.slice(0, 4);
        var hiddenCat = categories.slice(4, totalCount);
        return (
            <>
                {categories.length > 0 ?
                    <Grid container direction="row">
                        <Grid item xs>
                            <Accordion square className="no-shadow" expanded={expanded}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    className="pl-8"
                                    onClick={this.handleExpand}
                                >
                                    <Grid onClick={event => event.stopPropagation()} container direction="row" justify="flex-start" spacing={1}>
                                        {visibleCat.map((category, index) => (
                                            <React.Fragment key={category.id}>
                                                {index === 0 ?
                                                    <>
                                                        <Grid item xs={2} key={'selected'}>
                                                            <Button className="width-100 color-white" variant="contained" color="secondary" startIcon={<CheckCircle />}>
                                                                <Typography variant="caption" component="span" noWrap={true}>{activeCategory}</Typography>
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs={2} key={'all'}>
                                                            <Button className="width-100" variant="contained" color={isActive === 'all' ? "secondary" : "default"} onClick={() => this.handleCategoryFilterBtn('all')}>
                                                                <Typography variant="caption" component="span" noWrap={true}>{"ALL CATEGORY"}</Typography>
                                                            </Button>
                                                        </Grid>
                                                    </>
                                                    : null}
                                                <Grid item xs={2} >
                                                    <Button className="width-100" variant={isActive === category.id ? 'contained' : "outlined"} color={isActive === category.id ? "secondary" : "default"} onClick={() => this.handleCategoryFilterBtn(category)}>
                                                        <Typography variant="caption" component="span" noWrap={true}>{category.name}</Typography>
                                                    </Button>
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails className="pl-8 pr-8 pt-0">
                                    <Grid container direction="row" justify="flex-start" spacing={1}>
                                        {hiddenCat.map((category, index) => (
                                            <Grid item xs={2} key={category.id}>
                                                <Button className="width-100" variant={isActive === category.id ? 'contained' : "outlined"} color={isActive === category.id ? "secondary" : "default"} onClick={() => this.handleCategoryFilterBtn(category)}>
                                                    <Typography variant="caption" component="span" noWrap={true}>{category.name}</Typography>
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                    : null}
            </>
        )
    }
}

CategoryList.propTypes = {
    saveCategoryProducts: PropTypes.func.isRequired,
    saveBestsellingProducts: PropTypes.func.isRequired,
    saveRecommendedProducts: PropTypes.func.isRequired,
    saveCategories: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    productData: state.productData,
    cartProduct: state.cartProduct
});

const mapActionsToProps = {
    saveCategoryProducts,
    saveBestsellingProducts,
    saveRecommendedProducts,
    saveCategories,
    loading,
    alert
};

export default connect(mapStateToProps, mapActionsToProps)(CategoryList);
