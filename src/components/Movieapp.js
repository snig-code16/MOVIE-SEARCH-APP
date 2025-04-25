import React, { useState, useEffect } from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import './movieapp.css';
import axios from 'axios';

const API_KEY = "8f2844a";

const Movieapp = () => {
    const [searchinput, setSearchinput] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [sortBy, setSortBy] = useState('title-asc');

    const fetchMovies = async (query) => {
        setLoading(true);
        setError(null);
        setMovies([]);

        try {
            const response = await axios.get('https://www.omdbapi.com', {
                params: {
                    apikey: API_KEY,
                    s: query,
                },
            });

            if (response.data.Response === "True") {
                let results = response.data.Search;

                // Sort by title or year
                results.sort((a, b) => {
                    if (sortBy === 'title-asc') return a.Title.localeCompare(b.Title);
                    if (sortBy === 'title-desc') return b.Title.localeCompare(a.Title);
                    if (sortBy === 'year-asc') return a.Year.localeCompare(b.Year);
                    if (sortBy === 'year-desc') return b.Year.localeCompare(a.Year);
                    return 0;
                });

                setMovies(results);
            } else {
                setError(response.data.Error || 'Could not find movies.');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchInputChange = (e) => setSearchinput(e.target.value);
    const handleSortChange = (e) => setSortBy(e.target.value);

    const handleSearchSubmit = () => {
        if (!searchinput.trim()) {
            setError("Please enter a movie title.");
            setMovies([]);
            return;
        }
        fetchMovies(searchinput);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    useEffect(() => {
        fetchMovies("Avengers");
    }, [sortBy]);

    return (
        <>
            <h1 className='container'>Explore the World of Cinema</h1>
            <div className='search'>
                <input
                    type="text"
                    placeholder='Search for a movie...'
                    value={searchinput}
                    className='searchbar'
                    onChange={handleSearchInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
                <button
                    onClick={handleSearchSubmit}
                    className='searchbtn'
                    disabled={loading}
                >
                    {loading ? '...' : <AiOutlineSearch />}
                </button>
            </div>

            {/* Filter Dropdowns */}
            <div className='filter-container'>
                <label>
                    Sort By:
                    <select value={sortBy} onChange={handleSortChange} className='dropdown'>
                        <option value="title-asc">Title A-Z</option>
                        <option value="title-desc">Title Z-A</option>
                        <option value="year-asc">Year Ascending</option>
                        <option value="year-desc">Year Descending</option>
                    </select>
                </label>
            </div>

            {loading && <p className='status-message'>Loading...</p>}
            {error && <p className='status-message error-message'>Error: {error}</p>}

            <div className='movie-results-container'>
                {!loading && !error && movies.length === 0 && searchinput && (
                    <p className='status-message'>No results found. Try a different search.</p>
                )}
                {movies.map((movie) => (
                    <div key={movie.imdbID} className='movie-card'>
                        {movie.Poster !== "N/A" ? (
                            <img src={movie.Poster} alt={`${movie.Title} Poster`} />
                        ) : (
                            <div className="no-poster">No Poster</div>
                        )}
                        <h2>{movie.Title} ({movie.Year})</h2>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Movieapp;
