import { API } from 'aws-amplify';
import { useEffect, useRef, useState } from 'react';
import { CommonProps } from './CommonProps';
import './Home.css';

export default function Home(props: CommonProps) {
  const [publicMessage, setPublic] = useState(null);
  const [privateMessage, setPrivate] = useState(null);

  const movieInput = useRef<any>(null);
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [movieChoices, setMovieChoices] = useState<string[]>([]);
  const [chosenMovieIndex, setChosenMovieIndex] = useState<number | undefined>();

  useEffect(() => {
    // Load our public and private API
    async function onLoad() {
      try {
        const response = await loadPublic();
        setPublic(response.message);
      } catch (e) {
        setPublic(null);
      }
      try {
        const response = await loadPrivate();
        setPrivate(response.message);
      } catch (e) {
        setPrivate(null);
      }
    }

    onLoad();
  }, [props.isAuthenticated]);

  function pickARandomMovie() {
    const chosenMovie = Math.floor(Math.random() * movieChoices.length);
    setChosenMovieIndex(chosenMovie);
  }

  const deleteFunction = (index: number) => {
    const newMovieChoices = [...movieChoices];
    newMovieChoices.splice(index, 1);
    setMovieChoices(newMovieChoices);
  };

  const addMovie = () => {
    setMovieChoices([...movieChoices, currentTitle]);
    setCurrentTitle('');
    movieInput.current?.focus();
  };

  function loadPublic() {
    return API.get('random-api', '/public', {});
  }

  function loadPrivate() {
    return API.get('random-api', '/private', {});
  }

  return (
    <div className="Home">
      {/* <h3>{publicMessage}</h3>
      <h3>{privateMessage === false ? 'Cannot load private message' : privateMessage}</h3> */}
      <header className="Home-header">
        <h1>Movie Picker</h1>
        <div key="new-movie-div" className="inline">
          <input
            ref={movieInput}
            autoFocus
            key="new-movie-input"
            type="text"
            placeholder="Replace me..."
            value={currentTitle}
            onChange={(event) => setCurrentTitle(event.target.value)}
            onKeyUp={(event) => event.code === 'Enter' && addMovie()}
          />
          <button disabled={currentTitle === ''} onClick={addMovie}>
            Add movie title
          </button>
          {chosenMovieIndex !== undefined ? <h5>We will be watching {movieChoices[chosenMovieIndex]} today</h5> : null}
          {chosenMovieIndex !== undefined ? (
            <button
              onClick={() => {
                setChosenMovieIndex(undefined);
                deleteFunction(chosenMovieIndex);
              }}
            >
              Accept
            </button>
          ) : null}
        </div>
        <br />
        <h3>Movie List</h3>
        <table>
          <tbody>
            {movieChoices.map((choice, index) => (
              <tr key={index}>
                <td>
                  <button onClick={() => deleteFunction(index)}>X</button>
                </td>
                <td>
                  <span>{choice}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <br />
        <button onClick={pickARandomMovie}>Pick a random movie!</button>
      </header>
      <footer className="Home-footer">
        Source:{' '}
        <a className="Home-link" href="https://github.com/lucacucchetti/hosted-apps">
          https://github.com/lucacucchetti/hosted-apps
        </a>
      </footer>
    </div>
  );
}
