import React, { Component } from 'react'
import PropTypes from 'prop-types';
import FormProvider, { createForm } from '../../lib/index.js'
import ContactForm from './ContactForm'
import {  builtinValidators as Validators } from 'simple-form-validator';

console.log('ReactForm = ', FormProvider, createForm);
const ContactApp = () => {
  const validators = {
    'fullname': [Validators.length('name should be at least 3 letters', 3, 15)],
    'fullname2': [Validators.isRequired('name can not be empty'), Validators.isSame('should have the same value as fullname', 'fullname')],
    'age': [Validators.isNumber('age should be only digits'), Validators.range('age should be between 1 and 150', 1, 150)],
    'income': [Validators.isRequired('income should be provided')]
  }

  //let form = createForm(validators, { stopOnErr: true, implicitRequired: false })(ContactForm);

  return (
    <div>
      <p>A demo contact form, created by using <i>createForm</i> </p>
      <div><h3>Contact us</h3>
        Please fill in the contact form below, and we will contact you as soon as possible
        { createForm(validators, { stopOnErr: true, implicitRequired: false })(ContactForm) }
      </div>
      <hr />
      <p>A demo contact form, created by using <i>FormProvider</i> </p>
      <section><h3>Contact us</h3>
        Please fill in the contact form below, and we will contact you as soon as possible
        <FormProvider validators={validators} options={{ stopOnErr: false }} >
          <ContactForm />
        </FormProvider>
      </section>
    </div>
  )
};

export default ContactApp;
  