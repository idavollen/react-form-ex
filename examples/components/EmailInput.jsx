import React, { Component, PropTypes } from 'react'
import {builtinValidators} from 'simple-form-validator'
import TextInput from './TextInput'

class EmailInput extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  	console.log('EmailInput props: ', this.props)
    this.props.addNewField('email', this.props.defaultValue, builtinValidators.isEmail('a valid email address should look like i.e name@example.com'), {required: true, msg: 'email should not be empty'});
  }

  render() {
  	const {name, onChange, onBlur, valid, invalid, msg} = this.props;
  	console.log('EmailInput: ', this.props)

  	return (
	    <TextInput {... this.props} />
	  )	
  }
  
};

export default EmailInput;
  