import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import GCRadio from './GCRadio';
import GCCheckbox from './GCCheckbox';
import GCSelect from './GCSelect';
import GCInputLabel from './GCInputLabel';

class GCInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      type: 'text',
      validationMessage: null,
      touchedByParent: props.touchedByParent,
    };
  }

  componentWillMount() {
    this.determineType(this.props.type);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.touchedByParent && this.props.touchedByParent !== nextProps.touchedByParent) {
      this.setState({ touchedByParent: true }, () => {
        this.validateInput();
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.value !== this.props.value && this.props.type !== 'select')
    || this.props.type === 'select'
    || nextProps.touchedByParent !== this.props.touchedByParent
    || nextState.validationMessage !== this.state.validationMessage
    || nextProps.options !== this.props.options;
  }

  componentDidUpdate() {
    if (this.props.type === 'checkbox' || this.props.type === 'radio') {
      this.validateInput();
    }
  }

  determineType(type) {
    let inputType;
    switch (type) {
      case 'name':
        inputType = 'text';
        break;
      case 'text':
      case 'url':
        inputType = 'text';
        break;
      case 'email':
        inputType = 'email';
        break;
      case 'checkbox':
        inputType = 'checkbox';
        break;
      case 'password':
        inputType = 'password';
        break;
      case 'date':
        inputType = 'date';
        break;
      case 'range':
        inputType = 'range';
        break;
      case 'number':
        inputType = 'number';
        break;
      case 'textarea':
        inputType = 'textarea';
        break;
      case 'radio':
        inputType = 'radio';
        break;
      case 'select':
        inputType = 'select';
        break;
      default:
        inputType = 'text';
        break;
    }
    this.setState({ type: inputType });
  }

  validateEmail(value) {
    const pattern = this.handleRegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const valid = pattern.test(value);
    return this.handleErrorMessage(valid, 'The email address you have entered is not valid');
  }

  validateName(value) {
    const pattern = this.handleRegExp(/\d/);
    const maxL = this.props.maxLength;
    let valid;

    if ((maxL && value.length < maxL) || !maxL) {
      valid = pattern.test(value);
      if (!this.props.customRegex) {
        valid = !valid;
      }
      return this.handleErrorMessage(valid);
    } else {
      return this.handleErrorMessage(valid, `May not contain more than ${maxL} characters`);
    }
  }

  validateUrl(value) {
    let usableUrl = '';
    if ((/^(https:\/\/|http:\/\/)/).test(value)) {
      usableUrl = value;
    } else {
      usableUrl = `https:// ${value}`;
    }
    const valid = /[.]+/.test(usableUrl);
    return this.handleErrorMessage(valid, 'Url is not valid');
  }

  validateTextarea(value) {
    const pattern = this.handleRegExp('');
    const minL = this.props.minLength;
    const maxL = this.props.maxLength;
    let valid;
    if (minL && value.length < minL) {
      return this.handleErrorMessage(valid, `May not contain less than ${minL} characters`);
    } else if (maxL && value.length > maxL) {
      return this.handleErrorMessage(valid, `May not contain more than ${maxL} characters`);
    } else {
      valid = pattern.test(value);
      return this.handleErrorMessage(valid);
    }
  }

  validatePassword(value) {
    const min = this.props.minLength && this.props.minLength !== 0 ? this.props.minLength : 8;
    const pattern = this.handleRegExp('');
    if(value.length < min ) {
      return this.handleErrorMessage(false, `Password needs to have more than ${min} characters`, true);
    } else if (!pattern.test(value)) {
      return this.handleErrorMessage(false);
    }
  }

  validateDate(value) {
    console.log("validate date");
    const selectedDate = new Date(value);
    let min, max;

    if(this.props.maxDate !== null && this.props.minDate !== null) {
      max = new Date(this.props.maxDate);
      min = new Date(this.props.minDate);
      return this.handleErrorMessage(min >= selectedDate && max <= selectedDate, `Please select a date between ${min.toDateString()} and ${max.toDateString()}`);
    } else if(this.props.minDate !== null) {
      min = new Date(this.props.minDate);
      return this.handleErrorMessage(min >= selectedDate, `Please select a date after ${min.toDateString()}`);
    } else if (this.props.maxDate !== null) {
      max = new Date(this.props.maxDate);
      return this.handleErrorMessage(max <= selectedDate, `Please select a date before ${max.toDateString()}`);
    }
  }

  validateNumber(value) {
    const min = this.props.min;
    const max = this.props.max;
    let res = '';
    if (min && min > value) {
      res = this.handleErrorMessage(false, `Number must be higher than ${min}.`);
    } else if (max && max < value) {
      res = this.handleErrorMessage(false, `Number must be lower than ${max}`);
    }
    return res;
  }

  validateCheckbox(value) {
    let res = null;
    if (this.props.options.length > 0) {
      const minL = this.props.minLength;
      const maxL = this.props.maxLength;
      if (minL && minL > value.length) {
        res = `Please select more than ${minL} options`;
      } else if (maxL && maxL < value.length) {
        res = `Please select less than ${maxL} options`;
      }
    }
    return res;
  }

  isEmpty(v) {
    return (v === null || v === undefined) || (typeof v === 'string' && v !== '') || (typeof v === 'object' && v.length > 0) || (typeof v === 'boolean' && v && this.props.required);
  }

  validateInput() {
    const props = this.props;
    let error = null;
    if (this.isEmpty(props.value) && props.isVisible) {
      switch (props.type) {
        case 'email':
          error = this.validateEmail(props.value);
          break;
        case 'password':
          error = this.validatePassword(props.value);
          break;
        case 'name':
        case 'text':
          error = this.validateName(props.value);
          break;
        case 'date':
          error = this.validateDate(props.value);
          break;
        case 'number':
          error = this.validateNumber(props.value);
          break;
        case 'textarea':
          error = this.validateTextarea(props.value);
        case 'checkbox':
          error = this.validateCheckbox(props.value);
          break;
        case 'url':
          error = this.validateUrl(props.value);
          break;
        case 'range':
        default:
          error = null;
          break;
      }
    } else if (props.required && props.isVisible) {
      error = 'This field is required';
    }

    if (this.state.touchedByParent) {
      this.props.sendResultsToForm(!error);
    }
    this.setState({
      validationMessage: error,
      touchedByParent: false
    });
  }

  handleErrorMessage(v, msg = 'Invalid Input', ignoreCustom = false) {
    if (!v) {
      return this.props.customErrorMessage && !ignoreCustom ? this.props.customErrorMessage : msg;
    }
    return null;
  }

  handleRegExp(regX) {
    if (this.props.customRegex) {
      return new RegExp(this.props.customRegex);
    }
    return new RegExp(regX);
  }

  handleChange(v) {
    if (!this.props.disabled) {
      this.props.onChange(v, this.props.stateName);
    }
  }

  renderInput() {
    const invalidClass = this.state.validationMessage ? 'gc-input--invalid' : '';
    const disabledClass = this.props.disabled ? 'gc-input--disabled' : '';
    if (this.props.type === 'textarea') {
      const textareaClass = `gc-input__textarea--${this.props.size}`;
      return (<textarea
        className={`${invalidClass} ${disabledClass} ${textareaClass}`}
        disabled={this.props.disabled}
        name={this.props.name}
        defaultValue={this.props.value}
        placeholder={this.props.placeholder}
        onBlur={() => this.validateInput()}
        onChange={e => this.handleChange(e.target.value)}
        min={this.props.min}
        max={this.props.max}
        title={this.props.title}
      />);
    } else if (this.props.type === 'radio') {
      return (<GCRadio {...this.props} onChange={v => this.handleChange(v)} />);
    } else if (this.props.type === 'checkbox') {
      return (<GCCheckbox {...this.props} onChange={v => this.handleChange(v)} />);
    } else if (this.props.type === 'select') {
      return (
        <GCSelect
          {...this.props}
          onChange={v => this.handleChange(v)}
          validateInput={() => this.validateInput()}
          dynamicClasses={`${invalidClass} ${disabledClass}`}
        />);
    } else if (this.props.type === 'number') {
      return (<input
        className={`${invalidClass} ${disabledClass}`}
        disabled={this.props.disabled}
        name={this.props.name}
        type={this.state.type}
        placeholder={this.props.placeholder}
        onBlur={() => this.validateInput()}
        onChange={e => this.handleChange(e.target.value)}
        min={this.props.min}
        max={this.props.max}
        title={this.props.title}
        defaultValue={this.props.value}
      />);
    } else {
      return (
        <input
          className={`${invalidClass} ${disabledClass}`}
          disabled={this.props.disabled}
          name={this.props.name}
          type={this.state.type}
          value={this.props.value}
          placeholder={this.props.placeholder}
          onBlur={() => this.validateInput()}
          onInput={e => this.handleChange(e.target.value)}
          onChange={e => this.handleChange(e.target.value)}
          maxLength={this.props.max}
          min={this.props.min}
          max={this.props.max}
          title={this.props.title}
        />);
    }
  }

  render() {
    if (this.props.isVisible) {
      return (
        <div className={`gc-input ${this.props.extendedClassNames}`}>
          {this.renderInput()}

          {this.props.title !== "" && this.props.type !== 'select' && this.props.type !== 'radio' && this.props.type !== 'date' && (
            <GCInputLabel
              title={this.props.title}
              value={this.props.value}
              name={this.props.name}
              required={this.props.required}/>
          )}

          {this.state.validationMessage && (
            <p className="gc-input__error-msg">
              {this.state.validationMessage}
            </p>
          )}
        </div>
      );
    } else {
      return (<span>&nbsp;</span>);
    }

  }
}

GCInput.propTypes = {
  extendedClassNames: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.array,
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.array,
  ]),
  stateName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  maxDate: PropTypes.string,
  minDate: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  customRegex: PropTypes.object,
  customErrorMessage: PropTypes.string,
  touchedByParent: PropTypes.bool,
  sendResultsToForm: PropTypes.func,
  options: PropTypes.array,
  required: PropTypes.bool,
  size: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.object,
  formTemplate: PropTypes.func,
  isVisible: PropTypes.bool,
};

GCInput.defaultProps = {
  extendedClassNames: '',
  value: null,
  defaultValue: null,
  disabled: false,
  name: '',
  placeholder: '',
  maxLength: null,
  minLength: null,
  maxDate: null,
  minDate: null,
  max: null,
  min: null,
  customRegex: null,
  customErrorMessage: null,
  touchedByParent: false,
  sendResultsToForm: null,
  options: [],
  required: false,
  size: 'medium',
  title: null,
  data: null,
  formTemplate: null,
  isVisible: true,
};

export default GCInput;
