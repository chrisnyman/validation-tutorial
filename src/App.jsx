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
    const today = new Date();
    const thisYear = today.getFullYear();
    const minAgeDate = new Date(thisYear - 5, 1, 1);

    const formFields = {
      name: {
        name: 'name', // Required
        stateName: 'name', // Required
        type: 'text', // Required
        title: 'Name',
        value: this.state.name, // Required
        required: true
      },
      email: {
        name: 'emailAddress',
        stateName: 'email',
        type: 'email',
        title: 'Email Address',
        value: this.state.email,
        required: true
      },
      birthdate: {
        name: 'birthdate',
        stateName: 'birthdate',
        type: 'date',
        title: 'Date of Birth',
        value: this.state.birthdate,
        customErrorMessage: 'User must be at least 5 years old',
        maxDate: minAgeDate,
      },
      favoriteAnimal: {
        name: 'favoriteAnimal',
        stateName: 'favoriteAnimal',
        type: 'select',
        title: 'Favorite Animal',
        value: this.state.favoriteAnimal,
        isVisible: this.state.name.charAt(0) === 'F' || this.state.name.charAt(0) === 'f',
        options: [{
            label: 'Unicorn',
            value: 'unicorn'
          }, {
            label: 'Pheonix',
            value: 'pheonix'
          }, {
            label: 'Dragon',
            value: 'dragon'
          }, {
            label: 'Goldfish',
            value: 'goldfish'
        }]
      }
    };
    return(
      <div className="app-wrapper">
        <header className="app-header">
          <h1>validation-tutorial</h1>
        </header>

        {/* FORM GOES HERE */}

        {/*
          Create a form with the following fields:
            Name*
            email*
            birthdate
            favourite animal
          On a successful submit make an alert appear
        */}
        <GCForm
          data={formFields}
          onSubmit={() => this.formSubmitted()}
          handleInputChange={(v, t) => this.handleChange(v, t)}>
            {({ fields }) => (
              <div>
                {fields.name}
                {fields.email}
                {fields.birthdate}
                {fields.favoriteAnimal}
                <button>Submit Form</button>
              </div>
            )}
        </GCForm>
      </div>
    );
  }
}
