import { computed } from 'mobx';
import React, { Component } from 'react';

class NumberInput extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '', valid: true }
    }

    componentDidMount() {
        // set initial value of input
        const initValue = this.props.input.value || '';
        this.setValue(initValue);
    }

    isNumber = (value) => ((/^(?:[1-9]\d*|0)?(?:\.\d+)?$/g).test(value));

    setValue = (value) => { this.setState({value}); }

    _handleChange = (e) => {
        const value = e.target.value;
        this.setValue(value);
        
        // Temporary way to validate values :P
        // until Adobe XD implements proper number inputs
        const isNumber = this.isNumber(value);
        this.setState({valid: isNumber});
        if (isNumber) return this.props.onChange(value);
    }

    render() {
        const { valid, value } = this.state;
        const { title, input } = this.props;

        return (
            <label>
                <span className={(!valid) && 'color-red'}>{title || ''}</span>
                <input type='text' {...input} value={this.val || value}
                    onChange={this._handleChange}/>
            </label>
        )
    }    
}

export default NumberInput;