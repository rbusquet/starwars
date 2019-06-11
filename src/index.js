import React from "react";
import ReactDOM from "react-dom";

function SelectMovies(props) {
  const handleChange = ev => {
    const movie = props.movies.find(
      movie => Number(movie.episode_id) === Number(ev.target.value)
    );
    return props.onMovieChange(movie);
  };
  return (
    <select onChange={handleChange} value="0">
      <option value="0">--</option>
      {props.movies.map(movie => (
        <option key={movie.episode_id} value={movie.episode_id}>
          {movie.title}
        </option>
      ))}
    </select>
  );
}

async function fetchData() {
  const response = await fetch("https://swapi.co/api/films/");
  const json = await response.json();
  return json.results.map(({ episode_id, title, release_date }) => ({
    episode_id,
    title,
    release_date
  }));
}

function MovieTable(props) {
  return (
    <table>
      <tbody>
        {props.movies.map(movie => (
          <tr key={movie.episode_id}>
            <td>{movie.episode_id}</td>
            <td>{movie.title}</td>
            <td>{movie.release_date}</td>
            <td>
              <button onClick={() => props.onDelete(movie)}>x</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  const [movies, setMovies] = React.useState([]);
  const [selectedMovies, setSelectedMovies] = React.useState([]);
  const selectableMovies = movies.filter(
    m => !selectedMovies.find(sm => m.episode_id === sm.episode_id)
  );
  React.useEffect(() => {
    fetchData().then(movies => setMovies(movies));
  }, []);

  const handleChange = movie =>
    setSelectedMovies(movies => movies.concat([movie]));

  const handleDelete = movie =>
    setSelectedMovies(movies =>
      movies.filter(sm => movie.episode_id !== sm.episode_id)
    );

  return (
    <>
      <SelectMovies movies={selectableMovies} onMovieChange={handleChange} />
      <MovieTable movies={selectedMovies} onDelete={handleDelete} />
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
