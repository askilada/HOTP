var cry = require('crypto')


function hex2intArr(hex) {
    const ar = hex.match(/.{2}/g)
    const bytes = ar.map(h => parseInt(h, 16))
    return Buffer.from(bytes)
}
function dec2hex(dec, padding) {
    padding = typeof padding === "undefined" || padding === null ? 2 : padding
    let hex = dec.toString(16)
    while (hex.length < padding) {
        hex = "0"+hex
    }
    return hex
}


function HOTP(_secret, _counter, _options) {
    const defaults = {
        keySize: 6,
        algo: 'sha1'
    }

    options = typeof _options === "object" ? Object.assign({}, defaults, _options) : defaults
    

    const secretBuffer  = hex2intArr(_secret)
    const counter       = hex2intArr(dec2hex(_counter, 16))
    const hmac          = cry.createHmac(options.algo, secretBuffer).update(counter).digest()
    const offsetBit     = hmac[19] & 0xf

    const bin1      = hmac.slice(offsetBit, offsetBit+4)
    const bin1dec   = parseInt(bin1.toString('hex'), 16)

    const bin2  = bin1dec & ~(1<<31)
    let key     = (bin2 % Math.pow(10, options.keySize)).toString()

    while(key.length < options.keySize) {
        key = '0'+key
    }

    return key
}

exports.HOTP = HOTP
