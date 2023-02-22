
function wait(duration) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => resolve(), duration)
    })
}

export default wait