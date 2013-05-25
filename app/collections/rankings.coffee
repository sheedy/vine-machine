Collection = require './collection'

class Rankings extends Collection

    url: -> "http://msspm-achievements.appspot.com/rankings"

    parse: (data) ->
        _.map data, (ranking) =>
            ranking.id = ranking.email
            ranking.gravatar = "https://secure.gravatar.com/avatar/#{CryptoJS.MD5(ranking.email)}?d=404&s=160"
            ranking.firstName = ranking.name.split(' ')[0]
            ranking.lastName = ranking.name.split(' ')[0]
            ranking

    comparator: (a, b) => b.get('score') - a.get('score')

module.exports = Rankings