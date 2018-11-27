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

    _validate(value) {
        // Temporary way to validate values
        // until Adobe XD implements proper number inputs
        return ((/^(?:[1-9]\d*|0)?(?:\.\d+)?$/g).test(value));
    }

    _handleChange = (e) => {
        const value = e.target.value;
        this.setState({value});
        if (this._validate(value))
            return this.props.input.onValidChange(value);
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