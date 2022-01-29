import axios from 'axios'

const base_endpoint = axios.create({
    baseURL: 'https://vcm-24682.vm.duke.edu:8000',
    timeout: 2000,
})

export { base_endpoint }