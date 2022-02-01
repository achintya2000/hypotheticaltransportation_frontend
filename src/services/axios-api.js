import axios from 'axios'

const base_endpoint = axios.create({
    baseURL: 'https://vcm-25137.vm.duke.edu',
    timeout: 5000,
})

export { base_endpoint }