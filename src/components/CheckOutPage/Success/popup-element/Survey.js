import React, { Component } from "react";
import { Box, Button, Divider, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Tab, Tabs, Typography } from "@material-ui/core";
import StoreHelper from "../../../../Helper/storeHelper"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TabPanel from "../../../theme/TabPanel"
import { getSurveyQuestions, submitSurvey } from "../../../../redux/action/customerAction"
import { alert } from "../../../../redux/action/InterAction"

export function NextButton(props) {
    const { index, isSelected, isSubmit } = props;
    return (
        <>
            {!isSubmit ?
                <Button size="large" variant="contained" color="secondary" onClick={() => props.handleNext(index)} disabled={!isSelected}>Continue</Button>
                :
                <Button size="large" variant="contained" color="secondary" onClick={() => props.submitFeedback()} disabled={!isSelected}>Submit</Button>
            }
        </>
    )
}

class Survey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "Q1",
            questions: [],
            feedBack: {},
            submitted: false
        }
    }

    componentDidMount() {
        let questions = StoreHelper.getFromSession('feedback_questions');
        if (questions) {
            this.setState({
                questions: JSON.parse(questions)
            })
        } else {
            this.props.getSurveyQuestions("")
                .then(res => res.json())
                .then(res => {
                    if (res.success && res.data && res.data.data) {
                        this.setState({
                            questions: JSON.parse(res.data.data)
                        })
                    }
                    this.saveQuestionsInSession()
                })
                .catch(err => {
                    this.saveQuestionsInSession()
                })
        }
    }

    saveQuestionsInSession = () => {
        const { questions } = this.state
        StoreHelper.setInSession("feedback_questions", JSON.stringify(questions));
    }

    handleNext = (index) => {
        const { questions } = this.state
        if (Number(index + 1) < questions.length) {
            this.setState({
                activeTab: "Q" + Number(index + 2)
            })
        }
    };

    handleBack = (index) => {
        this.setState({
            activeTab: "Q" + Number(index)
        })
    };

    selectOpt = (e, q, index) => {
        this.setState({
            feedBack: {
                ...this.state.feedBack,
                [q]: e.target.value
            }
        })
        this.handleNext(index)
    }

    isOptSelect = (question) => {
        const { feedBack } = this.state
        let keys = Object.keys(feedBack);
        if (keys && keys.length > 0 && keys.includes(question)) {
            return true;
        }
        return false;
    }

    isChecked = (question, option) => {
        let isChecked = false;
        const { feedBack } = this.state
        if (feedBack[question] === option) {
            isChecked = true;
        }
        return isChecked
    }

    isSubmit = (index) => {
        let isAllSelected = false
        const { questions, feedBack } = this.state
        let keys = Object.keys(feedBack);
        if (keys.length === questions.length && questions.length === Number(index + 1)) {
            isAllSelected = true;
        }
        return isAllSelected;
    }

    submitFeedback = () => {
        const { checkoutData } = this.props;
        let mob = (checkoutData.customer.phone_number) ? checkoutData.customer.phone_number : "";
        const { feedBack } = this.state
        let fdbkData = [];
        let keys = Object.keys(feedBack);
        keys.forEach(q => {
            let newData = {};
            newData['question'] = q
            newData['feedback'] = feedBack[q]
            fdbkData.push(newData);
        })
        if (fdbkData && fdbkData.length > 0) {
            let formData = {}
            formData['cphone'] = mob;
            formData['data'] = JSON.stringify(fdbkData);
            this.props.submitSurvey(formData)
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        this.props.alert(true, "Feedback submitted successfully.")
                        this.setState({
                            submitted: true,
                            questions: []
                        })
                    } else {
                        this.props.alert(true, "Feedback not submitted!")
                    }
                })
                .catch(err => {
                    this.props.alert(true, "Something went wrong!")
                })
        }
    }

    render() {
        const { activeTab, questions, submitted } = this.state
        return (
            <>
                {!submitted && questions && questions.length > 0 ?
                    <Box>
                        <Divider />
                        <div className="display-flex">
                            <Tabs
                                variant="scrollable"
                                orientation="vertical"
                                value={activeTab}
                                aria-label="Vertical tabs example"
                                className="background-lite-gray feedback-tabs"
                            >
                                {questions.map((q, index) => (
                                    <Tab key={index} label={"Q" + Number(index + 1)} value={"Q" + Number(index + 1)} />
                                ))}
                            </Tabs>
                            {questions.map((q, index) => (
                                <TabPanel key={index} value={"Q" + Number(index + 1)} index={activeTab}>
                                    <Box p={2} pb={0} pr={0}>
                                        <FormControl>
                                            <FormLabel id="demo-radio-buttons-group-label">
                                                <div className="display-flex">
                                                    <Typography variant="h6" color="textPrimary" noWrap>
                                                        {"Q" + Number(index + 1)}:&nbsp;
                                                    </Typography>
                                                    <Typography className="flex-1" color="textPrimary" variant="h6">
                                                        {q.question}
                                                    </Typography>
                                                </div>
                                            </FormLabel>
                                            <RadioGroup
                                                name={q.question}
                                                onChange={(e) => this.selectOpt(e, q.question, index)}
                                            >
                                                {q.options && q.options.length > 0 ?
                                                    <>
                                                        {q.options.map((opt, opIndex) => (
                                                            <FormControlLabel
                                                                key={opIndex}
                                                                value={opt}
                                                                label={opt}
                                                                control={
                                                                    <Radio
                                                                        onClick={() => this.handleNext(index)}
                                                                        checked={this.isChecked(q.question, opt)}
                                                                    />
                                                                }
                                                            />
                                                        ))}
                                                    </>
                                                    : null
                                                }
                                            </RadioGroup>
                                        </FormControl>
                                        <Box pt={2}>
                                            <Grid container alignItems="center" justify="space-between">
                                                <Grid item>
                                                    <Button
                                                        size="small"
                                                        onClick={() => this.handleBack(index)}
                                                        disabled={index <= 0 ? true : false}
                                                    >
                                                        Back
                                                    </Button >
                                                </Grid>
                                                <Grid item>
                                                    <NextButton
                                                        index={index}
                                                        handleNext={this.handleNext}
                                                        isSelected={this.isOptSelect(q.question)}
                                                        isSubmit={this.isSubmit(index)}
                                                        submitFeedback={this.submitFeedback}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </TabPanel>
                            ))}
                        </div>
                    </Box>
                    : null
                }
            </>
        )
    }

}

Survey.propTypes = {
    getSurveyQuestions: PropTypes.func.isRequired,
    submitSurvey: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    checkoutData: state.checkoutData
})

const mapActionsToProps = {
    getSurveyQuestions,
    submitSurvey,
    alert
}


export default connect(mapStateToProps, mapActionsToProps)(Survey);