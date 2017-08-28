import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import _ from 'lodash';

export default function GCInputLabel({title, required, name, value}) {
  const inlineClass = _.isEmpty(value) ? 'gc-input__label--inline' : '';
  const requiredClass = required ? 'gc-input__label--required' : '';
  if (!_.isEmpty(title)) {
    return (
      <label
        className={`gc-input__label ${inlineClass} ${requiredClass}`}
        htmlFor={name}>
        {title}
      </label>
    );
  }
  return null;
};
