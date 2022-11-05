import { Auth } from 'aws-amplify';
import { FormEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import { useFormFields } from '../lib/hooksLib';
import { CommonProps } from './CommonProps';
import './Login.css';

export default function Login(props: CommonProps) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      // Log the user in
      await Auth.signIn(fields.email, fields.password);
      props.userHasAuthenticated(true);
      // Redirect to the homepage
      history.push('/');
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={fields.password} onChange={handleFieldChange} />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={isLoading || !validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
}
