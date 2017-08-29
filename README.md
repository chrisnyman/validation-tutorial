# <b style="color:#dfa4d7">validation-tutorial</b>
A small little tutorial to get the basics of the GradConnection form validation library
## Setup
**Step 1:** Clone repository

**Step 2:** Make sure you're running node 6+

**Step 3:** Run `npm install`

## Tutorial

The aim of this tutorial is create a basic form that asks a user for their name, email address, birthdate and their favorite animal.

**Requirements**

- The _name_ and _email_ fields are compulsory.
- The user should be older than 5 years old and an appropriate error message should be displayed, e.g. _User must be older than 5_.
- The _favorite animal_ field should be a select type input and should only be rendered if the _name_ field starts with the letter _F_.

** Usage Guide **

1. Import 'GCForm' from Components folder
2. Set up state for form and add handler fn.

```js
handleChange(value, type) {
  const obj = {};
  obj[type] = value;
  this.setState(obj);
}
```

3. Create form fields object to be passed into the GCForm.

```js

const today = new Date();
const thisYear = today.getFullYear();
const minAgeDate = new Date(thisYear - 5, 1, 1);

const formfields = {
  name: {
    name: 'name', // Required
    stateName: 'name', // Required
    type: 'text', // Required
    title: 'Name'
    value: this.state.name, // Required
    required: true
  },
  email: {
    name: 'emailAddress',
    stateName: 'email',
    type: 'email',
    title: 'Email Address'
    value: this.state.email,
    required: true
  },
  birthdate: {
    name: 'birthdate',
    stateName: 'birthdate',
    type: 'date',
    title: 'Date of Birth'
    value: this.state.birthdate,
    minDate: minAgeDate,
  },
  favoriteAnimal: {
    name: 'favoriteAnimal',
    stateName: 'favoriteAnimal',
    type: 'select',
    title: 'Favorite Animal'
    value: this.state.favoriteAnimal,
    options: [
      {
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
      }
    ]
  }
}

```

4. Pass form fields data into _GCForm_ and arrange fields inside the render method.

```js
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
```
Create function that will run after form is successfully validated.

```js
formSubmitted() {
  alert('Yay! The form was successfully submitted');
}
```
