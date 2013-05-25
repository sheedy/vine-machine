iphone = {}

iphone.init = ->
    $('#vine').empty()

    if not window.navigator.standalone
        return alert('Add My Super Sweet Promitzvah to your Home Screen')

    iphone.setup_events()

iphone.setup_events = ->

    window.ondeviceorientation = (event) ->
        alpha = 360 - parseInt(event.alpha, 10)
        $('body').css('background-color', 'hsla(' + alpha + ', 50%, 75%, 1)')

module.exports = iphone