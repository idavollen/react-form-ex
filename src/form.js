import createValidators from 'simple-form-validator';
import React, { Component, PropTypes, Children } from 'react';

export default class FormProvider extends Component {
  getChildContext() {
    return { validators: this.validators }
  }

  constructor(props, context) {
    super(props, context);
    this.validators = createValidators(props.validators);
    this.fields = Object.keys(props.validators);
    this.state = this._initState();
  }

  _initState() {
    var state = {}
    this.fields.forEach( field => {
      state[field] = {
        value: '',
        msg: undefined
      }
    })
    return state;  
  }

  componentWillMount() {
    var cbs = {}
    const cb = field => (value, validate = true) => {
      let msg = validate && this.validators.validateField(field, value) || undefined;
      let fieldState = {};
      fieldState[field] = { value: value, msg: msg }
      this.setState({ ...this.state, ...fieldState })
    }
    // add new validators on top of existing ones
    const addValidator = field => (...validators) => {
      this.validators.addValidator(field, ...validators);
    }

    this.fields.forEach( field => {
      cbs[field] = {
        onChange: cb(field),
        onBlur: cb(field),
        addValidator: addValidator(field)
      }
    });
    cbs.validateForm = (formdata = {} ) => { 
      if (!formdata || Object.keys(formdata).length === 0) {
        formdata = {};
        this.fields.forEach( field => {
          formdata[field] = this.state[field] ? this.state[field].value : '';
        })
      }   
      let fieldState = {}, err;
      for (let field in formdata) {
        let msg = this.validators.validateField(field, formdata[field]);
        err = err || msg;
        fieldState[field] = { value: formdata[field], msg }
      }
      this.setState({ ...this.state, ...fieldState });
      return err
    }
    // add validators for a new form field, that is, there exists no validators for this field
    cbs.addNewField = (field, ...validators) => {
      if (!this.fields.includes(field)) {
        this.fields.push(field);
        addValidator(field)(...validators);
        cbs[field] = {
          onChange: cb(field),
          onBlur: cb(field),
          addValidator: addValidator(field)
        }  
        let fieldState = {};
        fieldState[field] = {
          value: '',
          msg: undefined
        }
        this.setState({ ...this.state, ...fieldState })
      }
    }
    this.cbs = cbs;
  }

  mapStateToProps() {
    var props = {}
    this.fields.forEach( field => {
      props[field] = Object.assign({}, this.cbs[field], {
        valid: this.state[field].msg === undefined,
        invalid: this.state[field].msg !== undefined,
        msg: this.state[field].msg
      })
    })
    props.validateForm = this.cbs.validateForm;
    props.addNewField = this.cbs.addNewField;
    return props;
  }

  render() {
    var props = this.mapStateToProps();
    return (
      <div>
        { React.cloneElement(this.props.children, { ...props, validators: this.validators }) }
      </div>
    );
  }
}

FormProvider.propTypes = {
  validators: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}

FormProvider.childContextTypes = {
  validators: PropTypes.object.isRequired
}