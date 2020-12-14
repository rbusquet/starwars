import { ChangeEvent, useEffect, useState } from "react";
import ReacCellOM from "react-dom";
import styled from "styled-components";

interface Movie {
  title: string;
  release_date: string;
  episode_id: string;
}

function SelectMovies(props: {
  movies: Movie[];
  onMovieChange(movie: Movie): void;
}) {
  const handleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const movie = props.movies.find(
      (movie: Movie) => Number(movie.episode_id) === Number(ev.target.value)
    );
    return movie && props.onMovieChange(movie);
  };
  return (
    <select onChange={handleChange} value="0">
      <option value="0">--</option>
      {props.movies.map((movie) => (
        <option key={movie.episode_id} value={movie.episode_id}>
          {movie.title}
        </option>
      ))}
    </select>
  );
}

async function fetchData() {
  const response = await fetch("https://swapi.dev/api/films/");
  const json = await response.json();
  return json.results.map(({ episode_id, title, release_date }: Movie) => ({
    episode_id,
    title,
    release_date,
  }));
}

const Table = styled.table`
  border: 1px solid;
`;

const Cell = styled.td`
  border: 1px solid;
`;

function MovieTable(props: { movies: Movie[]; onDelete(movie: Movie): void }) {
  return (
    <Table>
      <tbody>
        {props.movies.map((movie) => (
          <tr key={movie.episode_id}>
            <Cell>{movie.episode_id}</Cell>
            <Cell>{movie.title}</Cell>
            <Cell>{movie.release_date}</Cell>
            <Cell>
              <button onClick={() => props.onDelete(movie)}>x</button>
            </Cell>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const selectableMovies = movies.filter(
    (m) => !selectedMovies.find((sm) => m.episode_id === sm.episode_id)
  );
  useEffect(() => {
    fetchData().then((movies) => setMovies(movies));
  }, []);

  const handleChange = (movie: Movie) =>
    setSelectedMovies((movies) => movies.concat([movie]));

  const handleDelete = (movie: Movie) =>
    setSelectedMovies((movies) =>
      movies.filter((sm) => movie.episode_id !== sm.episode_id)
    );

  return (
    <>
      <SelectMovies movies={selectableMovies} onMovieChange={handleChange} />
      {selectedMovies.length ? (
        <MovieTable movies={selectedMovies} onDelete={handleDelete} />
      ) : null}
    </>
  );
}

const rootElement = document.getElementById("root");
ReacCellOM.render(<App />, rootElement);
