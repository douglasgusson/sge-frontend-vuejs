import axios from 'axios'

const production = false;

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
    if (production) {
        return 'https://sge-backend-spring.herokuapp.com';
    } else {
        return 'http://127.0.0.1:8080/';
    }
}

export default standard
