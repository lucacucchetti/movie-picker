import { ISignUpResult } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { FormEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import { useFormFields } from '../lib/hooksLib';
import { CommonProps } from './CommonProps';
import './Signup.css';

export default function Signup(props: CommonProps) {
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState<null | ISignUpResult>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0 && fields.password === fields.confirmPassword;
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      // Sign up the user
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      // Check the user's confirmation code
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      // Sign the user in
      await Auth.signIn(fields.email, fields.password);

      props.userHasAuthenticated(true);
      // Redirect to the homepage
      history.push('/');
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control autoFocus type="tel" onChange={handleFieldChange} value={fields.confirmationCode} />
          <Form.Text muted>Please check your email for the code.</Form.Text>
        </Form.Group>
        <Button block size="lg" type="submit" variant="success" disabled={isLoading || !validateConfirmationForm()}>
          Verify
        </Button>
      </Form>
    );
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={fields.password} onChange={handleFieldChange} />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" onChange={handleFieldChange} value={fields.confirmPassword} />
        </Form.Group>
        <Button block size="lg" type="submit" variant="success" disabled={isLoading || !validateForm()}>
          Signup
        </Button>
      </Form>
    );
  }

  return <div className="Signup">{newUser === null ? renderForm() : renderConfirmationForm()}</div>;
}
