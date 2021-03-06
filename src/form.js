import createValidators from 'simple-form-validator';
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

export default class FormProvider extends Component {
  getChildContext() {
    return { validators: this.validators }
  }

  constructor(props, context) {
    super(props, context);
    this.isInited = false
    this.validators = createValidators(props.validators);
    // stop-validating-on-error, which means no validating any more after the first validating error rises up
    // implicitRequired, by default true, all validators exception isRequired doesn't require an defined, valid value before validating
    // if implicitRequired is set false, it can be useful in scenario where a field is mandatory, but it has validator and the validator will take effect only when the field has a value
    this.options = { stopOnErr: true, implicitRequired: true, ...props.options }
    this.fields = Object.keys(props.validators);
    this.state = this._initState();
    this._initCallbacks();
  }

  
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.lang != nextProps.lang) {
      this.validators = createValidators(nextProps.validators);
      let state = {}, curState = this.state
      this.fields.forEach( field => {
        if (curState[field].msg) {
          let value = curState[field].value
          let msg = this.validators.validateField(field, value, { ...this.options, contextFields: this.cbs.formData() }) || undefined;
          state[field] = { value, msg }
        }
      })      
    }
    return true
  }

  componentDidMount() {
    this.isInited = true
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

  _initCallbacks() {
    var cbs = {}
    const getFormData =  (...fields) => {
      let formdata = {};
      fields = !fields || fields.length === 0? this.fields : fields;
      fields.forEach( field => {
        formdata[field] = this.state[field] ? this.state[field].value : '';
      })
      return formdata;
    }

    const validateField = field => (value, validate = true) => {
      let msg = validate && this.validators.validateField(field, value, { ...this.options, contextFields: getFormData() }) || undefined;
      let fieldState = {};
      fieldState[field] = { value, msg }
      if (!this.isInited) {
        this.setState(function(previousState, currentProps) {
          return {...previousState, ...fieldState};
        })
      } else {
        this.setState({ ...this.state, ...fieldState })
      }
    }

    // add new validators on top of existing ones
    const addValidator = field => (...validators) => {
      this.validators.addValidator(field, ...validators);
    }

    this.fields.forEach( field => {
      cbs[field] = {
        onChange: validateField(field),
        onBlur: validateField(field),
        addValidator: addValidator(field)
      }
    });

    cbs.validateForm = (...fields) => {
      let formdata = getFormData(...fields), fieldState = {}, err=[];
      fields = !fields || fields.length === 0? this.fields : fields;
      fields.forEach( field => {
        let fieldVal = this.state[field] ? this.state[field].value : '';
        let msg = this.validators.validateField(field, fieldVal, { ...this.options, contextFields: formdata });
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
          onChange: validateField(field),
          onBlur: validateField(field),
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
    cbs.formData = getFormData

    this.cbs = cbs;
  }



  getProps() {
    var props = {}
    this.fields.forEach( field => {
      props[field] = {
          ...this.cbs[field],
          value: this.state[field].value || '',
          valid: this.state[field].msg === undefined,
          invalid: this.state[field].msg !== undefined,
          msg: this.state[field].msg
      }
    })
    return { ...this.cbs, ...props}
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
