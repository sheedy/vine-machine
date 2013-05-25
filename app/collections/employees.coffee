Collection = require './collection'

defaultGravatarImage = if location.search isnt '?shame' then '404' else 'blank'

class Employees extends Collection

    url: -> "https://#{env.API_BASE}/awth/v1/users?active=true&access_token=#{app.hubspot.context.auth.access_token.token}&active-permissions=true&hub-id=#{ env.LOGIN_PORTAL }&permissions=true"

    parse: (data) ->
        _.map data.users, (employee) =>
            employee.gravatar = "https://secure.gravatar.com/avatar/#{CryptoJS.MD5(employee.email)}?d=#{defaultGravatarImage}"
            employee

    setRoles: (roleCollection) ->
        @each (employeeModel) ->

            role = ''
            employee = employeeModel.attributes

            if employee.permissionInfo?.permissions?.length
                roleId = employee.permissionInfo?.permissions[0].roleId
                role = roleCollection.get(roleId)?.get('name')

            # Updated from http://www.hubspot.com/company/management on Mar 22, 2013
            switch employee.email
                when 'jdsherman@hubspot.com' then role = 'COO'
                when 'bhalligan@hubspot.com' then role = 'Overhead'
                when 'dshah@hubspot.com' then role = 'CTO & Founder'
                when 'dcancel@hubspot.com' then role = 'Chief Product Officer'
                when 'mvolpe@hubspot.com' then role = 'Chief Marketing Officer'
                when 'dstack@hubspot.com' then role = 'CFO'
                when 'joneill@hubspot.com' then role = 'Chief Information Officer'
                when 'jkelleher@hubspot.com' then role = 'General Counsel'
                when 'mroberge@hubspot.com' then role = 'SVP Sales and Services'
                when 'amoorthy@hubspot.com' then role = 'VP Business Development'

            employee.role = role
        @

module.exports = Employees
