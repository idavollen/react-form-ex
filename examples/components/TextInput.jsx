import React, { Component } from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames'

class TextInput extends Component{
	constructor(props) {
		super(props)
		console.log('TextInput props:', props)
	}

	componentDidMount () {
		if (this.props.onChange && this.props.defaultValue) {
			// set the default value on store
			this.props.onChange(this.props.defaultValue, false)
		}
	}

	render() {
		const { name, onChange, onBlur, valid, invalid, msg, placeholder, label, type, defaultValue, enableChange } = this.props
		//console.log('TextInput props:', name, onChange, onBlur, valid, invalid, msg)
		let helpTxt = label || name
		let inputClz = classNames('form-control', {'validate-err': invalid}, {'validate-ok': valid})
	  return <div className="input-line form-group">
    	<label>{ helpTxt }</label>
      <input  name={name}  onBlur={ e =>{ onBlur(e.target.value) } } onChange={ e=>{ enableChange && onChange(e.target.value)} } className={ inputClz } placeholder={ placeholder? placeholder : '' } type={ type || 'text' } autoComplete={ type === 'password'? 'off' : 'on'} defaultValue={ defaultValue } />
      <span className="validate-err erros-msg">{ msg? msg.map( m => <span key={ m }>{m}</span> ) : ''}</span>      
    </div>
	}
}

export default TextInput;
  