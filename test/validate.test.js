var assert = require('chai').assert;
import createValidators, {builtinValidators, combineValidators} from 'simple-form-validator';

console.log('createValidators = ', createValidators, builtinValidators, combineValidators)
describe('Form validators', function() {
  describe('Literal validators config', function() {
    var validators
    beforeEach(function() {
      var validatorsConfig = {
        name: [{
            required: true,
            msg: 'name cannot be empty'
          }, {
            pattern: 'string',
            msg: 'name should be string'
          }],
        age: [
          {
            required: true,
            msg: 'age should be provided'
          }, {
            pattern: 'digits',
            msg: 'age should be digits'
          }
        ]
      }
      validators = createValidators(validatorsConfig);
    })
    it('validate.js should parse literal validators config', function() {
      var errMsg = validators.validateField('name', '');
      assert.equal(2, errMsg.length);
    })

    it('addValidator should work with literal validators config', function() {
      validators.addValidator('age', builtinValidators.range('age should be between 1 and 150', [1, 150]));
      var errMsg = validators.validateField('age', '');
      assert.equal(3, errMsg.length);
    })

    it('addValidator using validator object literal should work with literal validators config', function() {
      validators.addValidator('age', {
        range: [1, 150], 
        msg: 'age should be between 1 and 150'
      });
      var errMsg = validators.validateField('age', '');
      assert.equal(3, errMsg.length);
    })
  })


  describe('Validators config with built-in validators', function() {
    var formvalidators
    beforeEach(function() {
      formvalidators = createValidators({
        'income': [
            builtinValidators.isRequired('income should be given'), 
            builtinValidators.isNumber('valid income should be digits'), 
            builtinValidators.range('income should be between 0 and 100000000', 0, 100000000)
          ],
        'address':[
          builtinValidators.isString('valid address should be string'), 
          builtinValidators.length(5, 'valid address should be at least 5 letters')
          ]
        })
    });

    afterEach(function() {
      formvalidators = null
    });

    it('should income of "a" return two validation errors', function () {
      var msg = formvalidators.validateField('income', 'a');
      assert.equal(2, msg.length);
    });

    it('should income of "" return 3 validation errors', function () {
      var msg = formvalidators.validateField('income', '');
      assert.equal(3, msg.length);
    });

    it('address of 3 letters is too short', function () {
      var msg = formvalidators.validateField('address', 'vei');
      assert.equal(1, msg.length);
    });

    it('should validate form well when its fields is valid', function () {
      var msg = formvalidators.validateForm({'income': 500000, address: 'Harry Fetts Vei'});
      assert.equal(undefined, msg);
    });

    it('should return validation err if form data is invalid', function () {
      var msg = formvalidators.validateForm({'income': 500000, address: 'Vei'});
      assert.equal(1, msg.address.length);
    });

    it('the newly added validator should be applicable', function () {
    	formvalidators.addValidator('address', builtinValidators.isRequired('address can not be empty'))
      var msg = formvalidators.validateField('address', '');
      assert.equal(3, msg.length);
    });

    it('the newly added validator should be applicable', function () {
    	formvalidators.addValidator('address', builtinValidators.length(2, 'valid address should be at least 2 letters'))
      var msg = formvalidators.validateField('address', 'vei');
      assert.equal(undefined, msg);
    });

    it('options validator should work as enum', function () {
      formvalidators.addValidator('sex', builtinValidators.options('sex should have only two valid possible values', 'male', 'female'))
      var msg = formvalidators.validateField('sex', 'male');
      assert.equal(undefined, msg);
      msg = formvalidators.validateField('sex', 'man');
      assert.equal(1, msg.length);
    });

    it('if value is a function, it should be called during validating', function () {
      var emp = 'student';
      formvalidators.addValidator('employer', builtinValidators.isRequired('employer should be provided', function() {
        if (emp === 'student') return false;
        else if (emp === 'developer') return true;
      }))
      var msg = formvalidators.validateField('employer', '');
      assert.equal(undefined, msg);
      emp = 'developer';
      msg = formvalidators.validateField('employer', '');
      assert.equal(1, msg.length);
    });
  })
});