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
    this._initCallbacks();
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
    this.isInited = false
  }

  componentDidMount() {
    this.isInited = true
  }

  _initCallbacks() {
    var cbs = {}
    const cb = field => (value, validate = true) => {
      let msg = validate && this.validators.validateField(field, value) || undefined;
      let fieldState = {};
      fieldState[field] = { value: value, msg: msg }
      if (!this.isInited) {
        this.setState(function(previousState, currentProps) {
          return {...previousState, ...fieldState};
        })
      } else
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
    cbs.validateForm = (...fields) => {
      let formdata = {}, fieldState = {}, err=[];
      fields = !fields || fields.length === 0? this.fields : fields;
      fields.forEach( field => {
        let fieldVal = this.state[field] ? this.state[field].value : '';
        let msg = this.validators.validateField(field, fieldVal);
        msg && err.push(msg)
        fieldState[field] = { value: fieldVal, msg }
      })
      this.setState({ ...this.state, ...fieldState });
      return err.length > 0? err : null
    }
    // add validators for a new form field, that is, there exists no validators for this field
    cbs.addNewField = (field, defValue, ...validators) => {
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
          value: defValue || '',
          msg: undefined
        }
        this.setState({ ...this.state, ...fieldState })
      }
    }
    cbs.formData = (...fields) => {
      let formdata = {};
      fields = !fields || fields.length === 0? this.fields : fields;
      fields.forEach( field => {
        formdata[field] = this.state[field] ? this.state[field].value : '';
      })
      return formdata;
    }
    
    this.cbs = cbs;
  }

  getProps() {
    var props = {}
    this.fields.forEach( field => {
      props[field] = Object.assign({}, this.cbs[field], {
        valid: this.state[field].msg === undefined,
        invalid: this.state[field].msg !== undefined,
        msg: this.state[field].msg
      })
    })
    return Object.assign({},  this.cbs, props)
  }

  render() {
    var props = this.getProps();
    return <div className="react-form-ex">
      { React.cloneElement(this.props.children, { ...props, validators: this.validators }) }
    </div>
  }
}

FormProvider.propTypes = {
  validators: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}

FormProvider.childContextTypes = {
  validators: PropTypes.object.isRequired
}