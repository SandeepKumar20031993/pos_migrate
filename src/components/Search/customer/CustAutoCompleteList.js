import React, { Component } from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { customerData, getCustomerFromDb, fetchCustomer, transformAndSave } from "../../../services/customer-service"
import { updateCustId, updateCName, updateCPhone, updateCAdditionalComment } from "../../../redux/action/cartAction"

export class CustAutoCompleteList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            customerDataByPhone: [],
            customerDataByName: []
        }
    }

    componentDidMount() {
        if (customerData && customerData.length === 0) {
            getCustomerFromDb();
        }
        setTimeout(() => {
            this.findInDatabase();
        }, 500)
    }

    startSearch = () => {
        clearTimeout(this.timeout1);
        this.timeout1 = setTimeout(() => {
            this.findInDatabase();
        }, 0)
    }

    findInDatabase = () => {
        const { checkoutData } = this.props
        let phone = (checkoutData.customer.phone_number) ? checkoutData.customer.phone_number : "";
        let name = (checkoutData.customer.customer_name) ? checkoutData.customer.customer_name : "";
        let customer_id = (checkoutData.customer.customer_id) ? checkoutData.customer.customer_id : "";
        var dbresult = []
        if (!customer_id) {
            if (this.isSerchable("phone")) {
                dbresult = this.getFromDb(phone);
                if (dbresult && dbresult.length > 0) {
                    this.setCustomerData(dbresult, "phone");
                } else {
                    this.startServerSearch(phone, "phone");
                }
            } else if (this.isSerchable("name")) {
                dbresult = this.getFromDb(name);
                if (dbresult && dbresult.length > 0) {
                    this.setCustomerData(dbresult, "name");
                } else {
                    this.startServerSearch(name, "name");
                }
            } else {
                this.clearCustState();
            }
        } else {
            this.clearCustState();
        }
    }

    getFromDb = value => {
        const inputValue = this.escapeRegexCharacters(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        if (inputValue === '' || inputLength === 0) {
            return [];
        }
        const regex = new RegExp(inputValue, 'i');
        return customerData.filter(customer => regex.test(customer.phone) || regex.test(customer.name));
    };

    escapeRegexCharacters = (str) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    isSerchable = (searchby) => {
        let isSearchable = false
        const { checkoutData } = this.props
        let phone = checkoutData.customer.phone_number
        let name = checkoutData.customer.customer_name
        if (searchby === "phone") {
            if (phone && phone.length >= 4) {
                isSearchable = true
            }
        } else if (searchby === "name") {
            if (!phone && name && name.length >= 3 && isNaN(name)) {
                isSearchable = true
            }
        }
        return isSearchable
    }

    startServerSearch = (searchterm, searchby) => {
        clearTimeout(this.timeout2);
        this.timeout2 = setTimeout(() => {
            this.fetchFromServer(searchterm, searchby);
        }, 500)
    }

    fetchFromServer = (searchterm, searchby) => {
        let formData = {};
        formData.searchterm = searchterm;
        formData.searchby = searchby;
        fetchCustomer(formData)
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    this.saveToDatabase(resData.suggestions, searchby)
                } else {
                    this.clearCustState();
                }
            })
            .catch(err => {
                this.clearCustState();
            })
    }

    saveToDatabase = (resData, searchby) => {
        if (resData.length > 0) {
            transformAndSave(resData);
            this.setCustomerData(resData, searchby);
        }
    }

    setCustomerData = (data, searchby) => {
        if (searchby === "phone") {
            this.setState({
                customerDataByPhone: data.slice(0, 10)
            })
        }
        if (searchby === "name") {
            this.setState({
                customerDataByName: data.slice(0, 10)
            })
        }
        clearTimeout(this.timeout1);
        clearTimeout(this.timeout2);
    }

    clearCustState = () => {
        this.setState({
            customerDataByPhone: [],
            customerDataByName: []
        })
        clearTimeout(this.timeout1);
        clearTimeout(this.timeout2);
    }

    customerSelected = (customer) => {
        let name = (customer.name) ? customer.name : ""
        this.props.updateCName(name)
        let phone = (customer.phone) ? customer.phone : ""
        this.props.updateCPhone(phone);
        let additional_comment = (customer.additional_comment) ? customer.additional_comment : ""
        this.props.updateCAdditionalComment(additional_comment)
        let custid = (customer.value) ? customer.value : ""
        this.props.updateCustId(custid)
        this.clearCustState();
        let element = document.getElementById("outlined-name");
        if (element) {
            element.focus();
        }
    }

    componentDidUpdate() {
        this.startSearch()
    }

    componentWillUnmount() {
        this.clearCustState();
    }

    render() {
        const { type } = this.props
        const { customerDataByPhone, customerDataByName } = this.state
        return (
            <React.Fragment>
                {type === "phone" ?
                    <>
                        {customerDataByPhone.length > 0 ?
                            <div className="auto-complete-container">
                                <List>
                                    {customerDataByPhone.map((customer, index) => (
                                        <ListItem button key={index} onClick={() => { this.customerSelected(customer) }}>
                                            <ListItemText primary={customer.label} />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                            :
                            null
                        }
                    </>
                    : null
                }
                {type === "name" ?
                    <>
                        {customerDataByName.length > 0 ?
                            <div className="auto-complete-container">
                                <List>
                                    {customerDataByName.map((customer, index) => (
                                        <ListItem button key={index} onClick={() => { this.customerSelected(customer) }}>
                                            <ListItemText primary={customer.label} />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                            :
                            null
                        }
                    </>

                    : null
                }
            </React.Fragment >
        )
    }
}

CustAutoCompleteList.propTypes = {
    updateCustId: PropTypes.func.isRequired,
    updateCName: PropTypes.func.isRequired,
    updateCPhone: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    checkoutData: state.checkoutData
});

const mapActionsToProps = {
    updateCustId,
    updateCName,
    updateCPhone,
    updateCAdditionalComment
}

export default connect(mapStateToProps, mapActionsToProps)(CustAutoCompleteList)

