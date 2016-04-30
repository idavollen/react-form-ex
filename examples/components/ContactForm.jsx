import React, { Component, PropTypes } from 'react'
import TextInput from './TextInput'
import EmailInput from './EmailInput'
import IncomeInput from './IncomeInput'

const ContactForm = ({validateForm, addNewField, ...props}) => {
console.log('ContactForm:', validateForm, addNewField, ...props)
  return (
    <form>
      <TextInput name="fullname" {...props.fullname } />
      <TextInput name="age" { ...props.age } />
      <IncomeInput name="income"  {...props.income } />
      <EmailInput name="email" addNewField={ addNewField } { ...props.email }  />
      <input type="submit" onClick={ e=> { if (validateForm()) { console.log('EEEEEEEroor'); e.preventDefault(); }}} />
    </form>
  )
};

export default ContactForm;
  