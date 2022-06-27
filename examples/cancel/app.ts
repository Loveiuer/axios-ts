import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

// axios.get('/cancel/get1', {
//     cancelToken: source.token
// }).catch(function (e) {
//     if (axios.isCancel(e)) {
//         console.log('Request canceled', e.message)
//     }
// })

// setTimeout(() => {
//     source.cancel('Operation canceled by the user.')

//     axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function (e) {
//         if (axios.isCancel(e)) {
//             console.log('post', e.message)
//         }
//     })
// }, 100)

// let cancel: Canceler

// axios.get('/cancel/get', {
//     cancelToken: new CancelToken(c => {
//         cancel = c
//     })
// }).catch(function (e) {
//     if (axios.isCancel(e)) {
//         console.log('Request canceled')
//     }
// })

// setTimeout(() => {
//     cancel()
// }, 200)

let cancel //用于保存取消请求的函数
function getProducts1() {
    if (cancel) cancel()
    axios.get('/cancel/get1', {
        cancelToken: new axios.CancelToken(c => { //c 用于取消当前请求的函数
            //保存取消函数 将来使用
            cancel = c
        })
    }).then(
        response => {
            cancel = null
            console.log('请求1成功了', response.data);
        },
        error => {
            if (axios.isCancel(error)) {
                console.log('取消请求1的错误', error.message);
            } else {
                cancel = null
                console.log('请求1的错误', error.message);
            }
        }
    )
}
function getProducts2() {
    if (cancel) cancel()
    axios.get('/cancel/get2', {
        cancelToken: new axios.CancelToken(c => { //c 用于取消当前请求的函数
            //保存取消函数 将来使用
            cancel = c
        })
    }).then(
        response => {
            cancel = null
            console.log('请求2成功了', response.data);
        },
        error => {
            if (axios.isCancel(error)) {
                console.log('取消请求2的错误', error.message);
            } else {
                cancel = null
                console.log('请求2的错误', error.message);
            }
        }
    )
}
function cancelReq() {
    // 执行取消请求的函数
    if (typeof cancel == 'function') {
        cancel('强制取消请求')
    }
}

let btn1 = document.getElementById('btn1'), btn2 = document.getElementById('btn2'), btn3 = document.getElementById('btn3')
btn1.addEventListener('click', getProducts1)
btn2.addEventListener('click', getProducts2)
btn3.addEventListener('click', cancelReq)