import * as React from 'react';
import { Component } from 'react';

import GCForm from 'Components/GCValidation/GCForm/GCForm';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      birthdate: '',
      favoriteAnimal: '',
    }
  }

  handleChange(value, type) {
    this.setState({[type]: value});
  }

  formSubmitted() {
    alert('Yay! The form was successfully submitted');
  }

  render() {
    // Form fields object goes here
    return(
      <div className="app-wrapper">
        <header className="app-header">
          <h1>validation-tutorial</h1>
        </header>

        <p>// GCForm goes here </p>

      </div>
    );
  }
}
