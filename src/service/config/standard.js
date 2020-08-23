import axios from 'axios'

const standard = axios.create({
    baseURL: getBaseUrl(),
    timeout: 100000,
    transformResponse: [
        function (data) {
            return data
        }
    ]
})


function getBaseUrl() {
    if (process.env.NODE_ENV == process.env.NODE_ENV) {
        return 'http://127.0.0.1:8080/';
    } else {
        return 'https://sge-backend.heroku.aap/';
    }
}

export default standard
