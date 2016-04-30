import React, { PropTypes } from 'react'

const TextInput = ({name, onChange, onBlur, valid, invalid, msg}) => {
	console.log('TextInput props:', name, onChange, onBlur, valid, invalid, msg)
	let ht = `${name}: `
  return (
    <div className="input-line">
    	<label>{ ht }</label>
      <input name={name} onBlur={e =>{onBlur(e.target.value)}} onChange={e=>{ onChange(e.target.value)}} className={invalid? "validate-err" : ""} />
      <span className="validate-err erros-msg">{ msg? msg : ''}</span>      
    </div>
  )
};

export default TextInput;
  