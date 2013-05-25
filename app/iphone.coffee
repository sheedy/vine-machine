APP_CODE = 'fc59e2c330'

iphone = {}

iphone.total_flips = 0
iphone.flip_direction = 1

iphone.init = ->
    $('#vine').empty()

    if not window.navigator.standalone

        if localStorage and (window.location.search is '') and localStorage.getItem('achievement_grant_auth')
            return alert('Add My Super Sweet Promitzvah to your Home Screen')

        if localStorage and window.location.search
            localStorage.setItem('achievement_grant_auth', window.location.search)
            window.location.href = '/tv/'

    iphone.setup_events()

iphone.setup_events = ->

    window.ondeviceorientation = (event) ->
        alpha = parseInt(event.alpha, 10)

        if (((iphone.flip_direction is 1) and (0 < alpha < 50)) or ((iphone.flip_direction is -1) and (130 < alpha < 180)))
            iphone.total_flips++
            iphone.flip_direction *= -1

        if (iphone.total_flips % 25) is 24
            iphone.go_crazy()

        unless iphone.is_going_crazy
            $('body').css('background-color', 'hsla(' + (360 - alpha) + ', 65%, 80%, 1)')

iphone.go_crazy = ->
    iphone.is_going_crazy = true

    hue = 0
    crazyInterval = setInterval ->
        hue += 30
        $('body').css('background-color', 'hsla(' + hue + ', 100%, 75%, 1)')
    , 30

    setTimeout ->
        clearInterval crazyInterval
        iphone.is_going_crazy = false
        iphone.achievement()
    , 10 * 1000

iphone.achievement = ->
    if localStorage
        achievement_grant_auth = localStorage.getItem('achievement_grant_auth')
    if not achievement_grant_auth
        achievement_grant_auth = window.location.search
    if not achievement_grant_auth
        return
    url = "http://msspm-achievements.appspot.com/grant#{window.location.search}&app_code=#{APP_CODE}"
    $.get(url)

module.exports = iphone