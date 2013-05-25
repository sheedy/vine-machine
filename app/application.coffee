Login = require 'lib/login'
Router = require 'lib/router'

class Application

    initialize: =>
        @msspm = new Login

        @views = {}
        @collections = {}

        @setupStyles()

        @msspm.verifyUser (data) =>
            $('#loader').hide()

            @router = new Router

            Backbone.history.start
                pushState: true
                root: '/tv/'

            Object.freeze? @

    setupStyles: ->
        $('body').css
            background: constants.styles.background
            color: "rgb(#{constants.styles.color_rgb})"

module.exports = new Application