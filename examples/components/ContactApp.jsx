import React, { Component, PropTypes } from 'react'
import ReactForm, { createForm } from '../../lib/index.js'
import ContactForm from './ContactForm'
import {  builtinValidators as Validators } from 'simple-form-validator';

console.log('ReactForm = ', ReactForm, createForm);
const ContactApp = () => {
  var validators = {
    'fullname': [Validators.isRequired('name can not be empty'), Validators.length(3, 'name should be at least 3 letters')],
    'age': [Validators.isNumber('age should be only digits'), Validators.range('age should be between 1 and 150', 1, 150)],
    'income': [Validators.isNumber('income should be digits')]
  }

  var form = createForm(validators)(ContactForm);

  return (
    <div>
      <p>A demo contact form, created by using <i>createForm</i> </p>
      <div><h3>Kontakt oss</h3>
        Vennligst oppfyll Kontaktskjemaet under og vi skal kontakte deg som snart som mulig
        { form }
      </div>
      <hr />
      <span>
        The same contact form is created by using <i>ReactForm</i> explicitly
      </span>
      <section><h3>Kontakt oss</h3>
        Vennligst oppfyll Kontaktskjemaet under og vi skal kontakte deg som snart som mulig
        <ReactForm validators={validators} >
          <ContactForm />
        </ReactForm>
      </section>
    </div>
  )
};

export default ContactApp;
  