TVView = require 'views/tv'
NavigationView = require 'views/navigation'

navHandler = ->
    if not app.views.navigationView?
        app.views.navigationView = new NavigationView
    app.views.navigationView.render()

tvHandler = ->
    if not app.views.tvView?
        app.views.tvView = new TVView
    app.views.tvView.render()

class Router extends Backbone.Router

    routes:
        '': 'homeHandler'
        '/': 'homeHandler'

        'vine': 'vineHandler'
        'vine/': 'vineHandler'

        'rankings': 'rankingsHandler'
        'rankings/': 'rankingsHandler'

        '*anything': 'homeHandler'

    basicPageHandler: ->
        app.views.current_view = undefined
        $('#page').html require "../views/templates/#{Backbone.history.fragment}"

    homeHandler: ->
        navHandler()
        tvHandler()

    vineHandler: ->
        navHandler()
        tvHandler()
        app.views.tvView.setMode 'vine'

    rankingsHandler: ->
        navHandler()
        tvHandler()
        app.views.tvView.setMode 'rankings'

module.exports = Router