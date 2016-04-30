import React from 'react';
import ReactForm from './form';

export default function createForm(validatorConfigs) {
  return Form => (
	  <ReactForm validators={ validatorConfigs } >
	    <Form />
	  </ReactForm>
  );
}