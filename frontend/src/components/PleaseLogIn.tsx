import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { CommonProps } from './CommonProps';
import './Home.css';

export default function PleaseLogIn(props: CommonProps) {
  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Movie Picker</h1>
        <div key="new-movie-div" className="inline">
          <h2>Please log in to use this website</h2>
          <LinkContainer to="/login">
            <Nav.Link>Login</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/signup">
            <Nav.Link>Signup</Nav.Link>
          </LinkContainer>
        </div>
      </header>
    </div>
  );
}
