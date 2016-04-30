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
		      Vennligst oppfyll Kontaktskjemaet under og vi skal kontakte deg som snart som mulig
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
    const ContactForm = ({validateForm, addNewField, ...props}) => {
		  return (
		    <form>
		      <TextInput name="fullname" {...props.fullname } />
		      <TextInput name="age" { ...props.age } />
		      <IncomeInput name="income"  {...props.income } />
		      <EmailInput name="email" addNewField={ addNewField } { ...props.email }  />
		      <input type="submit" onClick={ e=> { if (validateForm()) { console.log('EEEEroor'); e.preventDefault(); }}} />
		    </form>
		  )
		};

		export default ContactForm;
  ```
- **validateForm** is normally used by form submit button, i.e. in the *onClick* event handler. It takes an optional *formData* object, comprising of name-value pairs for form fields and returns true if there exists validating errors. If the incoming *formData* is undefined, it validates entire form. On the contrary, you can pass a part of the form data for validation, such as the typical scenario, *Accordion*, where user will navigate from group 1 to group 2, however, group 1 needs to be validated first before transition

- **addNewField** is used to add validators for a **non-existing** form field, for instance, your react form will dynamically add a new form field and it should be included in form validations**(1)**. In code snippet over, the email field is not originally specified in the *validators* configuration, therefore *addNewField* is passed in as a properties and EmailInput component looks like as following: 
	```javascript
    class EmailInput extends Component {
		  constructor(props) {
		    super(props);
		  }

		  componentWillMount() {
		    this.props.addNewField('email', builtinValidators.isEmail('a valid email address should look like i.e name@example.com'), {required: true, msg: 'email should not be empty'});
		  }

		  render() {
		  	return (
			    <TextInput {... this.props} />
			  )	
		  }		  
		};

		export default EmailInput;
  ```

- [ **...props** ] *props* is a complex object and contains callbacks and properties for each form field. Take *props.age* for example:
	1. **name** 				the field name
	2. **valid** 				flag, true means no validating error
	3. **invalid**			flag, true menas existence of validating error
	4. **msg**					array of strings, validating error messages
	5. **onChange**			callback, it can be used to validate this field while *typing*
	6. **onBlur**				callback, it can be used to validate this field after *focusing out*
	7. **addValidator** callback, called to add new validators to this field	**(2)**

>(1), (2) when adding validators, either built-in validators or object literal validators can be used or combined


## Open Source Code

Source code for this npm package is available [idavollen@github](https://github.com/idavollen/react-form-ex)


Enjoy!

## License

MIT
