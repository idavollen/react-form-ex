import React from 'react';
import ReactForm from './form';

const createForm = (validatorConfigs, options={}) => Form => (
  <ReactForm validators={ validatorConfigs } options={ options } >
    <Form />
  </ReactForm>
);

export default createForm