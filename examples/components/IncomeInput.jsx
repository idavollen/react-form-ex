import React, { Component, PropTypes } from 'react'
import { builtinValidators } from 'simple-form-validator'
import TextInput from './TextInput'

class IncomeInput extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  	console.log('IncomeInput props: ', this.props)
    this.props.addValidator(builtinValidators.isNumber('the income should be digits'));
  }

  render() {
  	const {name, onChange, onBlur, valid, invalid, msg} = this.props;
console.log('IncomeInput props:', this.props)
  	return (
	    <TextInput {...this.props} />
	  )	
  }
  
};

export default IncomeInput;
  