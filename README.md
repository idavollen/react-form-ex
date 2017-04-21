React Form
=========================

A React FormProvider wraps your form component and provides your form with utilities of validating form fields or entire form by using [simple-form-validator](https://www.npmjs.com/package/simple-form-validator)


## Installation



```
npm install --save react-form-ex
```

This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like [Webpack](http://webpack.github.io) or [Browserify](http://browserify.org/) to consume [CommonJS modules](http://webpack.github.io/docs/commonjs.html).



## Documentation
There are two ways to utilize react-form-ex with your form compnent
1. [**FormProvider**] The React container component, *FormProvider* wraps your form component
  ```javascript
		const ContactApp = () => {
		  const validators = {
		    'fullname': [Validators.isRequired('name can not be empty'), Validators.length(3, 'name should be at least 3 letters')],
		    'age': [Validators.isNumber('age should be only digits'), Validators.range('age should be between 1 and 150', 1, 150)],
		    'income': [Validators.isNumber('income should be digits')]
		  }

		  return (
		    <section><h3>Kontakt oss</h3>
		      Vennligst oppfyll Kontaktskjemaet under og vi skal kontakte deg så snart som mulig
		      <FormProvider validators={validators} >
		        <ContactForm />
		      </FormProvider>
		    </section>
		  )
		};
  ```
2. [**createForm**] *createForm* is a helper high-order function, taking two parameters sequentially, *validatorCofnigurations*, and a *form-component*

  ```javascript
		const ContactApp = () => {
		  const validators = {
		    'fullname': [Validators.isRequired('name can not be empty'), Validators.length(3, 'name should be at least 3 letters')],
		    'age': [Validators.isNumber('age should be only digits'), Validators.range('age should be between 1 and 150', 1, 150)],
		    'income': [Validators.isNumber('income should be digits')]
		  }
		  const form = createForm(validators)(ContactForm);
		  return (
		    <section><h3>Kontakt oss</h3>
		      { form }
		    </section>
		  )
		};
  ```

In both cases mentioned above, the FormProvider, as a container component, passes many callbacks as properties to your form component, for instance, a simple contact form seems as following:	
  ```javascript
    const ContactForm = ({validateForm, formData, addNewField, ...props}) => {
		  return (
		    <form>
		      <TextInput name="fullname" { ...props.fullname } />
		      <TextInput name="age" { ...props.age } />
		      <IncomeInput name="income"  { ...props.income } />
		      <EmailInput name="email" addNewField={ addNewField } { ...props.email }  />
		      <input type="submit" onClick={ e=> { 
			      		let errMsgs = validateForm()
			      		if (errMsgs) { 
			      			console.log('EEEEroor', errMsgs); e.preventDefault(); }
			      		else {
			      			let data = formData();
			      			ajax.post(url, data)
			      		}
		      		}
		      	} />
		    </form>
		  )
		};

		export default ContactForm;
  ```
- **validateForm** is normally used by form submit button, i.e. in the *onSubmit* or *onClick* event handler. It takes an optional param *fields*, array of strings for form field names. If it's called without any parameters, it will validate the whole form. It returns array of error messages if there exists validating errors. On the contrary, you can pass a part of the form fields for validation, such as the typical scenario, *Accordion*, which contains a big complex form for customer registration. When users  navigate from section Personal Info to section Work Experience, however, section Personal Info needs to be validated first before navigation, i.e. *validateForm('fullname', 'email', 'mobile')

- **formData** is used to retrieve the form data. It accepts an optional parameter, *fields*, array of strings for form filed names. If *fields* is empty or undefined, the entire form data is returned. It returns the current values of these required form fields. The returned values could be invalid if it's called before *validateForm*. The normal usage of this method is called after the form is validated and the returned form data can be posted with ajax call

- **addNewField** is used to add validators for a **non-existing** form field, for instance, your react form will dynamically add a new form field and it should be included in form validations**(1)**. In code snippet over, the email field is not originally specified in the *validators* configuration, therefore *addNewField* is passed in as a properties and EmailInput component looks like as following: 
	```javascript
    class EmailInput extends Component {
		  constructor(props) {
		    super(props);
		  }

		  componentWillMount() {
		    this.props.addNewField('email', this.props.defaultValue, builtinValidators.isEmail('a valid email address should look like i.e name@example.com'), {required: true, msg: 'email should not be empty'});
		  }

		  render() {
		  	return (
			    <TextInput { ...this.props } />
			  )	
		  }		  
		};

		export default EmailInput;
  ```

- [ **...props** ] *props* is a complex object and contains callbacks and properties for each form field. Take *props.age* for example:
	1. **name** 				the field name
	2. **value** 				the current value
	3. **valid** 				flag, true means no validating error
	4. **invalid**				flag, true menas existence of validating error
	5. **msg**					array of strings, validating error messages
	6. **onChange**				callback, it can be used to validate this field while *typing*
	7. **onBlur**				callback, it can be used to validate this field after *focusing out*
	8. **addValidator** 		callback, called to add new validators to this field	**(2)**

- [ **support of defaultValue** ] If a form field has a default value, it is sent as property *defaultValue* for react component. In order to reflect the default value to *FormProvider* so that the later *formData* call can be able to retrive those default values, *onChange* should be called i.e. in method *componentDidMount*. Take a react component TextInput for instance:
	```javascript
	
		import React, { Component, PropTypes } from 'react'
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
				let helpTxt = label || name
				let inputClz = classNames('form-control', {'validate-err': invalid}, { 'validate-ok': valid })
			  return <div className="input-line form-group">
		    	<label>{ helpTxt }</label>
		      <input  name={name}  onBlur={ e =>{ onBlur(e.target.value) } } onChange={ e=>{ enableChange && onChange(e.target.value)} } className={ inputClz } placeholder={ placeholder? placeholder : '' } type={ type || 'text' } autoComplete={ type === 'password'? 'off' : 'on'} defaultValue={ defaultValue } />
		      <span className="validate-err erros-msg">{ msg? msg.map( m => <span key={ m }>{m}</span> ) : ''}</span>      
		    </div>
			}
		}

		export default TextInput;
	```


>(1), (2) when adding validators, either built-in validators or object literal validators can be used or combined


## Open Source Code

Source code for this npm package is available [idavollen@github](https://github.com/idavollen/react-form-ex)


Enjoy!

## License

MIT
