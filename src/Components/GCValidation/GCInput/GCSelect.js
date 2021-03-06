import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import GCInputLabel from './GCInputLabel';
import GCInputSVG from './GCInputSVG';

class GCSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      searchActive: false,
      index: -1,
      selection: this.getValue(props.options, this.props.value) || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const props = this.props;
    if (nextProps.value !== props.value || this.state.searchActive) {
      this.setState({
        selection: this.getValue(props.options, nextProps.value),
        searchActive: false,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.value !== this.props.value
      || nextState.searchActive
      || this.state.isActive !== nextState.isActive
      || nextProps.dynamicClasses !== this.props.dynamicClasses
      || nextState.index !== this.state.index;
  }

  getOpts(options) {
    if (options.length === 0) {
      return (
        <li
          className='gc-select__drop-down__option gc-select__drop-down__option--no-results'
          key={_.uniqueId()}>
          <label htmlFor={this.props.name}>
            {this.state.searchActive ? 'There are no matching results' : 'No available options'}
          </label>
        </li>
      );
    }
    return options.map((opt, index) => {
      const activeClass = opt.value === this.props.value ? 'gc-select__drop-down__option--active' : '';
      const hoveredClass = this.state.index === index ? 'gc-select__drop-down__option--hover' : '';
      const disabledClass = opt.disabled ? 'gc-select__drop-down__option--disabled' : '';
      return (
        <li
          className={`gc-select__drop-down__option ${activeClass} ${disabledClass} ${hoveredClass}`}
          key={_.uniqueId()}
          onClick={() => this.handleChange(opt.value, opt.disabled)}>
          <label htmlFor={this.props.name}>
            {opt.label}
          </label>
        </li>
      );
    });
  }

  getSearchResults(options, searchTxt) {
    if (searchTxt === '') {
      return options;
    }
    const pattern = new RegExp(searchTxt, 'i');
    return _.filter(options, o => pattern.test(o.label))
  }

  getValue(arr, value) {
    const valArray = arr.filter(i => i.value === value);
    return _.isEmpty(valArray) ? undefined : valArray[0].label;
  }

  handleChange(v, disabled = false) {
    if (!disabled) {
      this.props.onChange(v);
      this.setState({
        isActive: false,
        index: -1,
      }, () => this.props.validateInput());
    }
  }

  dropDownList(shouldOpen) {
    if (!shouldOpen) {
      setTimeout(() => this.setState({ isActive: false }, () => this.props.validateInput()), 50);
    } else {
      this.setState({ isActive: true });
    }
  }

  handleSearch(e) {
    const v = e.target.value;
    let state = this.state;
    if (this.state.searchActive) {
      state = { selection: v };
    } else {
      state = {
        selection: v,
        searchActive: true,
        isActive: true,
      };
    }
    this.setState(state);
  }

  handleEnter(e) {
    const { selection, index, searchActive } = this.state;
    const { options } = this.props;
    const queryArray = searchActive ? this.getSearchResults(options, selection) : options;

    if (e.keyCode === 13) {
      e.preventDefault();
      if (index > -1) {
        this.handleChange(queryArray[index].value);
      } else if (selection === '') {
        this.handleChange(selection);
      }
    } else if (e.keyCode === 38 && index > -1) {
      e.preventDefault();
      this.setState({ index: index - 1 });
    } else if (e.keyCode === 40 && queryArray.length - 1 > index) {
      e.preventDefault();
      this.setState({ index: index + 1 });
    }
  }

  renderOptions(options) {
    if (this.state.searchActive) {
      return this.getOpts(this.getSearchResults(options, this.state.selection));
    }
    return this.getOpts(options);
  }

  render() {
    return (
      <div
        className="gc-select"
        onBlur={() => this.dropDownList(false)}>
        <input
          className={`gc-select__input ${this.props.dynamicClasses}`}
          type="text"
          value={this.state.selection}
          placeholder={this.props.placeholder}
          onClick={() => this.dropDownList(true)}
          onKeyDown={e => this.handleEnter(e)}
          onChange={e => this.handleSearch(e)}/>

        <GCInputLabel
          title={this.props.title}
          value={this.state.selection}
          name={this.props.name}
          required={this.props.required}/>

        {this.state.isActive ? (
          <GCInputSVG type="chevronUp" className="gc-select__input-icon"/>
        ) : (
          <GCInputSVG type="chevronDown" className="gc-select__input-icon"/>
        )}

        {this.state.isActive && (
          <ul className="gc-select__drop-down">{this.renderOptions(this.props.options)}</ul>
        )}
      </div>
    );
  }
}

GCSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  dynamicClasses: PropTypes.string.isRequired,
  title: PropTypes.string,
  validateInput: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
};

GCSelect.defaultProps = {
  placeholder: '',
  title: '',
};

export default GCSelect;
