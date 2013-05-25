vine = require 'vine'
iphone = require 'iphone'

class Application

    initialize: =>
        if (navigator.userAgent.match(/iPhone/i)) or (navigator.userAgent.match(/iPod/i))
            return iphone.init()

        vine.init()

module.exports = new Application