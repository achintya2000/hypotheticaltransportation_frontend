import axios from 'axios'

const getAPI = axios.create({
    baseURL: 'http://vcm-24682.vm.duke.edu:8000',
    timeout: 1000,
})

export { getAPI }