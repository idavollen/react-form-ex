import React, { Component, PropTypes } from 'react'
import FormProvider, { createForm } from '../../lib/index.js'
import ContactForm from './ContactForm'
import {  builtinValidators as Validators } from 'simple-form-validator';

console.log('ReactForm = ', FormProvider, createForm);
const ContactApp = () => {
  var validators = {
    'fullname': [Validators.isString('name should be at least 3 letters')],
    'fullname2': [Validators.isRequired('name can not be empty'), Validators.isSame('should have the same value as fullname', 'fullname')],
    'age': [Validators.isNumber('age should be only digits'), Validators.range('age should be between 1 and 150', 1, 150)],
    'income': [Validators.isNumber('income should be digits')]
  }

  var form = createForm(validators, { stopOnErr: true, implicitRequired: false })(ContactForm);

  return (
    <div>
      <p>A demo contact form, created by using <i>createForm</i> </p>
      <div><h3>Kontakt oss</h3>
        Vennligst oppfyll Kontaktskjemaet under og vi skal kontakte deg som snart som mulig
        { form }
      </div>
      <hr />
      <p>A demo contact form, created by using <i>FormProvider</i> </p>
      <section><h3>Kontakt oss</h3>
          Vennligst oppfyll Kontaktskjemaet under og vi skal kontakte deg så snart som mulig
          <FormProvider validators={validators} options={{ stopOnErr: false }} >
            <ContactForm />
          </FormProvider>
        </section>
    </div>
  )
};

export default ContactApp;
  