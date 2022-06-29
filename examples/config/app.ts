import axios, { AxiosTransformer } from '../../src/index'
// import axios from 'axios'
import qs from 'qs'

// axios.defaults.headers.common['test2'] = 123

// axios.defaults.headers.post['test3'] = 666

// axios({
//     url: '/config/post',
//     method: 'post',
//     data: qs.stringify({
//         a: 1
//     }),
//     headers: {
//         test: '321'
//     }
// }).then((res) => {
//     console.log(res.data)
// })

/* axios({
    transformRequest: [(function (data) {
        return qs.stringify(data)
    }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
    transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
        if (typeof data === 'object') {
            data.b = 2
        }
        return data
    }],
    url: '/config/post',
    method: 'post',
    data: {
        a: 1
    }
}).then((res) => {
    console.log(res.data)
}) */

// const instance = axios.create({
//     transformRequest: [(function (data) {
//         return qs.stringify(data)
//     }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
//     transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
//         if (typeof data === 'object') {
//             data.b = 2
//         }
//         return data
//     }]
// })

// instance({
//     url: '/config/post',
//     method: 'post',
//     data: {
//         a: 1
//     }
// }).then((res) => {
//     console.log(res.data)
// })
// console.log('default', axios.defaults);

// axios.interceptors.request.use(() => {
//     return {
//         url: '/config/post',
//         method: 'POST',
//         data: { b: 1 },
//         headers: {}
//     }
// })

axios({
    url: '/config/post',
    method: 'post',
    headers: {
        'content-type': 'application/json'
    }
})

