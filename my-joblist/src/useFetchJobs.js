//useReducer handles all the different states inside in our useFetchJobs
import {useReducer} from "react";

const ACTIONS = {
    MAKE_REQUEST: 'make-request',
    GET_DATA:'get-data',
    ERROR:'error'
}

// the reducer function will be called every time we called dispatch
// and dispatch whatever we passed on its goes to action
// and state is the state of our current application is
function reducer(state, action){
 switch (action.type){
     //when we are making a request we need to return a new state
     //every time we are doing a new request we just set loading and we are clearing our jobs
     case ACTIONS.MAKE_REQUEST:
         return{loading:true, jobs:[]}
    // when we are getting data, we are taking everything that belongs to our current state 
    // into a new state, we also going to change loading to false and pass our jobs into the payload
    // into our action and set that to the payload of data.
     case ACTIONS.GET_DATA:
         return {...state, loading:false, jobs:action.payload.jobs}
    // take and spread our current state
    // and pass our error object in and last we dont want to have any jobs so we are going to clear that out
     case ACTIONS.ERROR:
         return{...state, loading: false, error: action.payload.error, jobs:[]}
     default:
         return state
 }
}

export default function useFetchJobs(params, page){
    // the useReducer function will take a function and an initial state
    // the initial state will be an object with jobs loading to true.
    const[state, dispatch] = useReducer(reducer, {jobs:[], loading: true})


    return {
        jobs:[],
        loading: false,
        error:false
    }
}