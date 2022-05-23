import axios from 'axios';

const BASE_URL = 'https://backsigea.herokuapp.com';

const instance = axios.create({
    baseURL: BASE_URL,
})

export {
    instance as axios
}