import { API } from 'aws-amplify';
import { useEffect, useRef, useState } from 'react';
import { CommonProps } from './CommonProps';
import './Home.css';
import PleaseLogIn from './PleaseLogIn';

interface Movie {
  title: string;
  id: string;
}

export default function Home(props: CommonProps) {
  const movieInput = useRef<any>(null);
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [movieChoices, setMovieChoices] = useState<Movie[]>([]);
  const [chosenMovieIndex, setChosenMovieIndex] = useState<number | undefined>();
  const [pickingMovie, setPickingMovie] = useState<boolean>(false);

  useEffect(() => {
    // Load our public and private API
    async function onLoad() {
      if (!props.isAuthenticated) return;
      try {
        const response = await API.get('movie-list-api', '/list', {});
        console.log(response);
        setMovieChoices(response.items);
      } catch (e) {
        console.log(e);
        alert('Could not load list :(');
      }
    }

    onLoad();
  }, [props.isAuthenticated]);

  function pickARandomMovie() {
    setPickingMovie(true);
    const chosenMovie = Math.floor(Math.random() * movieChoices.length);
    setChosenMovieIndex(chosenMovie);
  }

  const deleteFunction = async (index: number) => {
    try {
      const result = await API.del('movie-list-api', '/movie', { body: { id: movieChoices[index].id } });
      console.log(result);
      const newMovieChoices = [...movieChoices];
      newMovieChoices.splice(index, 1);
      setMovieChoices(newMovieChoices);
    } catch (e) {
      alert('Could not delete a movie, are you logged in?');
    }
  };

  const addMovie = async () => {
    try {
      const { id } = await API.post('movie-list-api', '/movie', { body: { title: currentTitle } });
      console.log(id);
      setMovieChoices([...movieChoices, { title: currentTitle, id }]);
      setCurrentTitle('');
      movieInput.current?.focus();
    } catch (e) {
      alert('Could not add a movie, are you logged in?');
    }
  };

  if (!props.isAuthenticated) {
    return <PleaseLogIn {...props} />;
  }

  return (
    <div className="Home">
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
          {chosenMovieIndex !== undefined ? (
            <h5>We will be watching {movieChoices[chosenMovieIndex].title} today</h5>
          ) : null}
          {chosenMovieIndex !== undefined ? (
            <>
              <button
                onClick={() => {
                  setChosenMovieIndex(undefined);
                  deleteFunction(chosenMovieIndex);
                  setPickingMovie(false);
                }}
              >
                Accept
              </button>
              <button
                onClick={() => {
                  setPickingMovie(false);
                  setChosenMovieIndex(undefined);
                }}
              >
                Cancel
              </button>
            </>
          ) : null}
        </div>
        <br />
        <h3>Movie List</h3>
        <table>
          <tbody>
            {movieChoices.map((choice, index) => (
              <tr key={index}>
                <td>
                  <button disabled={pickingMovie} onClick={() => deleteFunction(index)}>
                    X
                  </button>
                </td>
                <td>
                  <span>{choice.title}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <br />
        <button disabled={movieChoices.length < 1} onClick={pickARandomMovie}>
          Pick a random movie!
        </button>
      </header>
    </div>
  );
}
