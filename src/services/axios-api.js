import axios from 'axios'

const base_endpoint = axios.create({
    baseURL: 'http://connectwise.colab.duke.edu:8000',
    timeout: 5000,
})

export { base_endpoint }