import React, { Component } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress';

class LinearLoading extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            
        }
    }

    render() {
        return (
            <LinearProgress variant="determinate" value={this.props.complete} />
        )
    }
}

export default LinearLoading