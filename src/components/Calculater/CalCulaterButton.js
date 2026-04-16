import React, { Component } from 'react';
import CartHelper from '../../Helper/cartHelper';

class KeyPadComponent extends Component {


    render() {
        return (
            <>
                <div className="buttondiv">
                    <button name={1} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>1</button>
                    <button name={2} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>2</button>
                    <button name={3} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>3</button>
                    <button name={100} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>{CartHelper.getCurrencyFormatted(100)}</button><br />


                    <button name={4} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>4</button>
                    <button name={5} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>5</button>
                    <button name={6} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>6</button>
                    <button name={200} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>{CartHelper.getCurrencyFormatted(200)}</button><br />

                    <button name={7} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>7</button>
                    <button name={8} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>8</button>
                    <button name={9} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>9</button>
                    <button name={500} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>{CartHelper.getCurrencyFormatted(500)}</button><br />


                    <button name={'.'} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>.</button>
                    <button name={0} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>0</button>
                    <button name={'C'} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>x</button>
                    <button name={2000} className="custombutton" onClick={e => this.props.onClick(e.target.name)}>{CartHelper.getCurrencyFormatted(2000)}</button><br />
                </div>
                <div className="buttondivreset">
                    <button name={'='} className="custombuttonxyz">&nbsp;</button>
                    <button name={'CE'} className="custombuttonreset" onClick={e => this.props.onClick(e.target.name)}>RESET</button><br />
                </div>
            </>
        );
    }

}


export default KeyPadComponent;