import React, { Component } from 'react';

class NumberInput extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' }
    }

    componentDidMount() {
        const initValue = this.props.input.value || '';
        this.setState({value: initValue});
    }

    isNumber = (value) => ((/^(?:[1-9]\d*|0)?(?:\.\d+)?$/g).test(value));
    _handleChange = (e) => {
        const value = e.target.value;
        this.setState({value});

        // Temporary way to validate values :P
        // until Adobe XD implements proper number inputs
        if (this.isNumber(value))
            return this.props.onChange(value);
    }

    render() {
        const { value } = this.state
        const { title, input } = this.props;

        return (
            <label>
                <span>{title || ''}</span>
                <input type='text' {...input} value={value}
                    onChange={this._handleChange}/>
            </label>
        )
    }    
}

export default NumberInput;