'use strict';
const {HOTP} = require('./hotp')


function TOTP(_secret, _options) {
    const defaultOptions = {step: 0}

    const options = typeof _options === "undefined" || _options === null ? defaultOptions : _options


    const unixStartTime = 0;
    const timeStep = 30

    const currentTime = (Date.now() / 1000) | 0
    const newTime = currentTime + options.step*timeStep
    
    const top = newTime - unixStartTime
    const step = Math.floor(top / timeStep)
    
    return HOTP(_secret, step, _options)
}
exports.TOTP = TOTP

