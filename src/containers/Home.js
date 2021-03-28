import React, { useCallback, useEffect, useState } from "react";
import { List } from "antd";
import { MovieItem } from "../components";
import request from "../services/request";
import { useAuthenActions } from "../shared";

const { Item } = List;
const Home = () => {
  const { isSignIn, userData } = useAuthenActions();
  const [moviesList, setMoviesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchDataTurn, setFetchDataTurn] = useState(0);
  const getMoviesList = useCallback(() => {
    setLoading(true);
    request
      .get("/movies")
      .then((res) => {
        setMoviesList(
          res.data.map((movie) => {
            const { upVotes, downVotes } = movie;
            let isVoted;
            let upVoted = false;
            let downVoted = false;

            if (userData) {
              upVoted = !!upVotes.find((user) => user._id === userData.id);
              downVoted = !!downVotes.find((user) => user._id === userData.id);
              isVoted = upVoted || downVoted;
            }
            return {
              ...movie,
              upVoteAmount: upVotes.length,
              downVoteAmount: downVotes.length,
              upVoted,
              downVoted,
              isVoted,
            };
          })
        );
      })
      .finally(() => setLoading(false));
  }, [userData]);
  const onMovieActions = (url, movieId) =>
    request
      .post(url, { movieId })
      .then(() => setFetchDataTurn((val) => val + 1));
  const onUpVoteMovie = (movieId) => () =>
    onMovieActions("movie/upvote", movieId);
  const onDownVoteMovie = (movieId) => () =>
    onMovieActions("movie/downvote", movieId);

  useEffect(() => {
    getMoviesList();
  }, [getMoviesList, isSignIn, fetchDataTurn]);
  return (
    <div className="home-container">
      <List
        loading={loading}
        dataSource={moviesList}
        renderItem={(movie) => (
          <Item>
            <MovieItem
              {...movie}
              onUpVoteMovie={onUpVoteMovie}
              onDownVoteMovie={onDownVoteMovie}
            />
          </Item>
        )}
      />
    </div>
  );
};

export default Home;
