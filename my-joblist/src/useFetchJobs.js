//useReducer handles all the different states inside in our useFetchJobs
import { useReducer, useEffect } from "react";
import axios from "axios";

const ACTIONS = {
  MAKE_REQUEST: "make-request",
  GET_DATA: "get-data",
  ERROR: "error",
  UPDATE_HAS_NEXT_PAGE: "update-has-next-page",
};

//create a single variable for the base url
const BASE_URL =
  "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json";

// the reducer function will be called every time we called dispatch
// and dispatch whatever we passed on its goes to action
// and state is the state of our current application is
function reducer(state, action) {
  switch (action.type) {
    //when we are making a request we need to return a new state
    //every time we are doing a new request we just set loading and we are clearing our jobs
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] };
    // when we are getting data, we are taking everything that belongs to our current state
    // into a new state, we also going to change loading to false and pass our jobs into the payload
    // into our action and set that to the payload of data.
    case ACTIONS.GET_DATA:
      return { ...state, loading: false, jobs: action.payload.jobs };
    // take and spread our current state
    // and pass our error object in and last we dont want to have any jobs so we are going to clear that out
    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        jobs: [],
      };
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage };
    default:
      return state;
  }
}

export default function useFetchJobs(params, page) {
  // the useReducer function will take a function and an initial state
  // the initial state will be an object with jobs loading to true.
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

  useEffect(() => {
    // because I dont want to have different kind of axios "dancing" around
    // whenever I typing a new character, so when the params changes we want ot cancel the old request
    // we create then a cancelToken
    const cancelToken1 = axios.CancelToken.source();
    dispatch({ type: ACTIONS.MAKE_REQUEST });
    axios
      .get(BASE_URL, {
        cancelToken: cancelToken1.token,
        params: { markdown: true, page: page, ...params },
      })
      .then((res) => {
        dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } });
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
      });

    const cancelToken2 = axios.CancelToken.source();
    axios
      .get(BASE_URL, {
        cancelToken: cancelToken2.token,
        params: { markdown: true, page: page + 1, ...params },
      })
      .then((res) => {
        dispatch({
          type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
          payload: { hasNextPage: res.data.length !== 0 },
        });
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
      });

    return () => {
      cancelToken1.cancel();
      cancelToken2.cancel();
    };
  }, [params, page]);

  return state;
}
//  we have 50 different hings been returned, because the API is paginated and only
//  returns 50 results per time inside our job portion which is our state
