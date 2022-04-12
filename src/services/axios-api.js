import axios from 'axios'

const base_endpoint = axios.create({
    //baseURL: 'https://vcm-25137.vm.duke.edu',
    baseURL: 'http://vcm-25180.vm.duke.edu:8002',
    timeout: 1000000,
})

export { base_endpoint }