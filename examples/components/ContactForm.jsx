import React, { Component, PropTypes } from 'react'
import TextInput from './TextInput'
import EmailInput from './EmailInput'
import IncomeInput from './IncomeInput'

const ContactForm = ({validateForm, formData, addNewField, ...props}) => {
console.log('ContactForm:', validateForm, addNewField, ...props)
  return (
    <form>
      <TextInput name="fullname" {...props.fullname }  />
      <TextInput name="fullname2" {...props.fullname2 }  />
      <TextInput name="age" { ...props.age } defaultValue="38" />
      <IncomeInput name="income"  {...props.income } />
      <EmailInput name="email" addNewField={ addNewField } { ...props.email } />
      <input type="submit" onClick={ e=> { 
      	console.log('formData = ', formData(), 'partial formData = ', formData('fullname', 'email'))
      	let ret = validateForm();
      	if (ret) { console.log('EEEEEEEroor:', ret); e.preventDefault(); }
      	else { console.log('validateForm is OK')}
      }} />
    </form>
  )
};

export default ContactForm;
  