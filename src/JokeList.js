import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Joke from './Joke'

import './JokeList.css'


const JokeList = ({ numOfJokesToGet = 5 }) => {
    const [jokesObj, setJokesObj] = useState({ jokes: [] })
    const [isLoading, setIsLoading] = useState(true)

    /* get jokes if there are no jokes */

    useEffect(() => {
        getJokes()
    }, [])

    async function getJokes() {
        try {
            let jokes = [];
            let seenJokes = new Set();

            while (jokes.length < numOfJokesToGet) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" }
                });

                let { ...joke } = res.data;

                if (!seenJokes.has(joke.id)) {
                    seenJokes.add(joke.id);
                    jokes.push({ ...joke, votes: 0 });
                } else {
                    console.log("duplicate found!");
                }
            }

            setJokesObj({ jokes });
            setIsLoading(false)
        } catch (err) {
            console.error(err);
        }
    }


    /* empty joke list, set to loading state. */

    function generateNewJokes() {
        setIsLoading(true);
        getJokes();
    }

    /* change vote for this id by num (+1 or -1) */

    function vote(id, num) {
        setJokesObj(state => ({
            jokes: state.jokes.map(obj =>
                obj.id === id ? { ...obj, votes: obj.votes + num } : obj
            )
        }));
    }

    let sortedJokes = jokesObj.jokes.sort((a, b) => b.votes - a.votes);

    /* render: either loading spinner or list of sorted jokes. */

    if (isLoading) {
        return (
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin" />
            </div>
        )
    }

    return (
        <div className="JokeList">
            <button
                className="JokeList-getmore"
                onClick={generateNewJokes}
            >
                Get New Jokes
            </button>

            {sortedJokes.map(j => (
                <Joke
                    text={j.joke}
                    key={j.id}
                    id={j.id}
                    votes={j.votes}
                    vote={vote}
                />
            ))}
        </div>
    );
}

export default JokeList;

