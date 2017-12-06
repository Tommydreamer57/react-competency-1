import axios from 'axios';

const initialState = {
    list: []
}

const _FULFILLED = '_FULFILLED'
const GET_LIST = 'GET_LIST'

export function getList() {
    let list = axios.get(`http://45.55.132.212/api/sections`).then(response => response.data)
    console.log(list)
    return {
        type: GET_LIST,
        payload: list
    }
}

export default function reducer(state = initialState, action) {
    console.log(action)
    switch(action.type) {
        case GET_LIST + _FULFILLED:
            return Object.assign({}, state, { list: action.payload })
        default:
            return state
    }
}
