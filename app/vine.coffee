vine = {}

vine.video_length = 6.5 * 1000

vine.mode = 0

vine.start_cycle_vine = ->
    vine.current_index = 0
    vine.cycle_vine()
    clearInterval vine.cycle_vine_interval
    vine.cycle_vine_interval = setInterval(vine.cycle_vine, vine.video_length * 3)

vine.cycle_vine = ->
    $('.vine-iframe-wrapper iframe').each ->
        $(this).attr 'src', vine.url_list[vine.current_index]

    vine.current_index = (vine.current_index + 1) % vine.url_list.length
    vine.load_vines() if vine.current_index >= vine.url_list.length

vine.load_vines = ->
    i = undefined
    j = undefined
    url = undefined
    vine.url_list = []
    vine.url_dict = {}
    $.getJSON 'http://search.twitter.com/search.json?q=' + vine.get_search_query() + '&rpp=100&include_entities=true&result_type=mixed&callback=?', (data) ->
        i = 0
        while i < data.results.length
            j = 0
            while j < data.results[i].entities.urls.length
                url = data.results[i].entities.urls[j].expanded_url
                if url.indexOf('vine.co/v/') > -1
                    unless vine.url_dict[url]
                        vine.url_list.push url + '/embed/postcard'
                        vine.url_dict[url] = true
                j++
            i++
        vine.start_cycle_vine()

vine.change_mode = ->
    $('#vine').get(0).className = ''
    $('#vine').addClass('vine-mode-' + vine.mode)
    vine.mode = (vine.mode + 1) % 5

vine.get_search_query = ->
    'vine.co+' + $('.vine-hash-input').val().replace('#', '').replace(new RegExp(' ', 'g'), '+')

vine.setup_search = ->
    $('.vine-hash-input').keyup (e) ->
        vine.load_vines()  if e.keyCode is 13

vine.setup_vine_autoplay = ->
    $('.vine-iframe-wrapper iframe').load ->
        @contentWindow.postMessage 'play', '*'

vine.init = ->
    vine.setup_search()
    vine.setup_vine_autoplay()
    vine.load_vines()

    vine.change_mode()
    setInterval ->
        vine.change_mode()
    , 3 * 10000

module.exports = vine