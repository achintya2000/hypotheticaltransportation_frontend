import axios from 'axios'

const base_endpoint = axios.create({
    //baseURL: 'http://vcm-25137.vm.duke.edu:8001',
    baseURL: 'http://vcm-25180.vm.duke.edu:8001',
    timeout: 10000,
})

export { base_endpoint }