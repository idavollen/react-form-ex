import React from 'react';
import FormProvider from './form';

const createForm = (validators, options={}) => Form => (
  <FormProvider validators={ validators } options={ options } >
    <Form />
  </FormProvider>
);

export default createForm