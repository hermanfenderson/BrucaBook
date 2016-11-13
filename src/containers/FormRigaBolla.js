import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import * as Actions from '../actions';

const validate = values => {
  const errors = {};

  if (!values.email) {
    errors.email = "Please enter an email.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.password) {
    errors.password = "Please enter a password.";
  }

  return errors;
};

class FormRigaBolla extends React.Component {
  handleFormSubmit = (values) => {
    this.props.aggiungiRigaBolla(1,values); 
  };

  renderField = ({ input, label, type, meta: { touched, error } }) => (
    <fieldset className={`form-group ${touched && error ? 'has-error' : ''}`}>
      <label className="control-label">{label}</label>
      <div>
        <input {...input} placeholder={label} className="form-control" type={type} />
        {touched && error && <div className="help-block">{error}</div>}
      </div>
    </fieldset>
  );

  renderAuthenticationError() {
    if (this.props.authenticationError) {
      return <div className="alert alert-danger">{ this.props.authenticationError }</div>;
    }
    return <div></div>;
  }

  render() {
    return(
      <div className="container">
        <div className="col-md-6 col-md-offset-3">
          <h2 className="text-center">Riga</h2>

          { this.renderAuthenticationError() }

          <form onSubmit={this.props.handleSubmit(this.handleFormSubmit)}>
            <Field name="ean" component={this.renderField} className="form-control" type="text" label="EAN"/>
            <Field name="titolo" component={this.renderField} className="form-control" type="text" label="Titolo"/>
            <Field name="autore" component={this.renderField} className="form-control" type="text" label="Autore"/>
            <Field name="prezzo" component={this.renderField} className="form-control" type="text" label="Prezzo"/>
            <Field name="copie" component={this.renderField} className="form-control" type="text" label="Copie"/>
            <Field name="totale" component={this.renderField} className="form-control" type="text" label="Totale"/>
            
            <button action="submit" className="btn btn-primary">Inserisci</button>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticationError: state.auth.error
  }
}

export default connect(mapStateToProps, Actions)(reduxForm({
  form: 'riga-bolla',
  validate
})(FormRigaBolla));