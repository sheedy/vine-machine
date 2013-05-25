(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  (function() {
    var Application, iphone, vine,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    vine = require('vine');

    iphone = require('iphone');

    Application = (function() {

      function Application() {
        this.initialize = __bind(this.initialize, this);
      }

      Application.prototype.initialize = function() {
        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
          return iphone.init();
        }
        return vine.init();
      };

      return Application;

    })();

    module.exports = new Application;

  }).call(this);
  
}});

window.require.define({"collections/collection": function(exports, require, module) {
  (function() {
    var Collection,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    module.exports = Collection = (function(_super) {

      __extends(Collection, _super);

      function Collection() {
        Collection.__super__.constructor.apply(this, arguments);
      }

      return Collection;

    })(Backbone.Collection);

  }).call(this);
  
}});

window.require.define({"collections/rankings": function(exports, require, module) {
  (function() {
    var Collection, Rankings,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Collection = require('./collection');

    Rankings = (function(_super) {

      __extends(Rankings, _super);

      function Rankings() {
        this.comparator = __bind(this.comparator, this);
        Rankings.__super__.constructor.apply(this, arguments);
      }

      Rankings.prototype.url = function() {
        return "http://msspm-achievements.appspot.com/rankings";
      };

      Rankings.prototype.parse = function(data) {
        var _this = this;
        return _.map(data, function(ranking) {
          ranking.id = ranking.email;
          ranking.gravatar = "https://secure.gravatar.com/avatar/" + (CryptoJS.MD5(ranking.email)) + "?d=404&s=160";
          ranking.firstName = ranking.name.split(' ')[0];
          ranking.lastName = ranking.name.split(' ')[0];
          return ranking;
        });
      };

      Rankings.prototype.comparator = function(a, b) {
        return b.get('score') - a.get('score');
      };

      return Rankings;

    })(Collection);

    module.exports = Rankings;

  }).call(this);
  
}});

window.require.define({"constants": function(exports, require, module) {
  (function() {
    var constants;

    constants = {
      app_name: 'msspm',
      styles: {
        background: '#000000',
        color_rgb: '255,255,255'
      }
    };

    module.exports = constants;

  }).call(this);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  (function() {

    window.utils = require('utils');

    window.constants = require('constants');

    window.app = require('application');

    _.mixin(_.string.exports());

    $(function() {
      return app.initialize();
    });

  }).call(this);
  
}});

window.require.define({"iphone": function(exports, require, module) {
  (function() {
    var APP_CODE, iphone;

    APP_CODE = 'fc59e2c330';

    iphone = {};

    iphone.total_flips = 0;

    iphone.flip_direction = 1;

    iphone.init = function() {
      $('#vine').empty();
      if (!window.navigator.standalone) {
        if (localStorage && (window.location.search === '') && localStorage.getItem('achievement_grant_auth')) {
          alert('Add My Super Sweet Promitzvah to your Home Screen');
        }
        if (localStorage && window.location.search) {
          localStorage.setItem('achievement_grant_auth', window.location.search);
          window.location.href = '/tv/';
        }
      }
      return iphone.setup_events();
    };

    iphone.setup_events = function() {
      return window.ondeviceorientation = function(event) {
        var alpha;
        alpha = parseInt(event.alpha, 10);
        $('#flips').html(iphone.total_flips);
        if (((iphone.flip_direction === 1) && ((0 < alpha && alpha < 50))) || ((iphone.flip_direction === -1) && ((130 < alpha && alpha < 180)))) {
          iphone.total_flips++;
          iphone.flip_direction *= -1;
        }
        if ((iphone.total_flips % 25) === 24) iphone.go_crazy();
        if (!iphone.is_going_crazy) {
          return $('body').css('background-color', 'hsla(' + (360 - alpha) + ', 65%, 80%, 1)');
        }
      };
    };

    iphone.go_crazy = function() {
      var crazyInterval, hue;
      iphone.is_going_crazy = true;
      hue = 0;
      crazyInterval = setInterval(function() {
        hue += 30;
        return $('body').css('background-color', 'hsla(' + hue + ', 100%, 75%, 1)');
      }, 30);
      return setTimeout(function() {
        clearInterval(crazyInterval);
        iphone.is_going_crazy = false;
        return iphone.achievement();
      }, 10 * 1000);
    };

    iphone.achievement = function() {
      var achievement_grant_auth, url;
      if (localStorage) {
        achievement_grant_auth = localStorage.getItem('achievement_grant_auth');
      }
      if (!achievement_grant_auth) achievement_grant_auth = window.location.search;
      if (!achievement_grant_auth) return;
      url = "http://msspm-achievements.appspot.com/grant" + achievement_grant_auth + "&app_code=" + APP_CODE;
      return $.get(url);
    };

    module.exports = iphone;

  }).call(this);
  
}});

window.require.define({"utils": function(exports, require, module) {
  (function() {
    var Utils,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    Utils = (function() {

      function Utils() {
        this.parseQueryString = __bind(this.parseQueryString, this);
      }

      Utils.prototype.getHTMLTitleFromHistoryFragment = function(fragment) {
        return _.capitalize(fragment.split('\/').join(' '));
      };

      Utils.prototype.simpleError = function(body, callback) {
        if (callback == null) callback = function() {};
        return this.simpleConfirm({
          header: 'An error occurred',
          body: body,
          callback: callback,
          buttons: [
            {
              text: 'OK',
              "class": 'btn btn-primary',
              close: true
            }
          ]
        });
      };

      Utils.prototype.simpleAlert = function(body, callback) {
        if (callback == null) callback = function() {};
        return this.simpleConfirm({
          header: '&nbsp;',
          body: body,
          callback: callback,
          buttons: [
            {
              text: 'Done',
              "class": 'btn btn-primary',
              close: true
            }
          ]
        });
      };

      Utils.prototype.simpleConfirm = function(options) {
        var id, modal;
        if (typeof options === 'string') {
          options = {
            body: options
          };
        }
        id = "" + (+new Date()) + "_" + (parseDec(Math.random() * 10000));
        options = _.extend({}, {
          id: id,
          callback: function() {},
          header: 'Confirm',
          body: 'Are you sure?',
          buttons: [
            {
              text: 'OK',
              "class": 'btn btn-primary',
              close: true
            }, {
              text: 'Cancel',
              "class": 'btn btn-secondary',
              close: true
            }
          ]
        }, options);
        $(require('./views/templates/modal')(options)).modal();
        modal = $('#' + options.id);
        modal.find('.btn-primary').unbind().click(function() {
          return options.callback(true);
        });
        return modal.find('.btn-secondary').unbind().click(function() {
          return options.callback(false);
        });
      };

      Utils.prototype.parseQueryString = function(queryString) {
        var a, i, name, name2, queryArray, stack, value;
        queryArray = queryString.split('&');
        stack = {};
        for (i in queryArray) {
          a = queryArray[i].split('=');
          name = a[0];
          value = (isNaN(a[1]) ? a[1] : parseFloat(a[1]));
          if (name.match(/(.*?)\[(.*?)]/)) {
            name = RegExp.$1;
            name2 = RegExp.$2;
            if (name2) {
              if (!(name in stack)) stack[name] = {};
              stack[name][name2] = value;
            } else {
              if (!(name in stack)) stack[name] = [];
              stack[name].push(value);
            }
          } else {
            stack[name] = value;
          }
        }
        return stack;
      };

      return Utils;

    })();

    module.exports = new Utils;

  }).call(this);
  
}});

window.require.define({"views/page_not_found": function(exports, require, module) {
  (function() {
    var H, PageNotFoundView, Particle, View, W, animloop, canvas, ctx, dist, distance, draw, ever_rendered, i, minDist, paintCanvas, particleCount, particles, update,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    View = require('./view');

    H = void 0;

    Particle = void 0;

    W = void 0;

    animloop = void 0;

    canvas = void 0;

    ctx = void 0;

    dist = void 0;

    distance = void 0;

    draw = void 0;

    i = void 0;

    minDist = void 0;

    paintCanvas = void 0;

    particleCount = void 0;

    particles = void 0;

    update = void 0;

    ever_rendered = false;

    PageNotFoundView = (function(_super) {

      __extends(PageNotFoundView, _super);

      function PageNotFoundView() {
        this.render = __bind(this.render, this);
        PageNotFoundView.__super__.constructor.apply(this, arguments);
      }

      PageNotFoundView.prototype.template = require('./templates/404');

      PageNotFoundView.prototype.render = function() {
        $(this.el).html(this.template);
        canvas = document.getElementById("page-not-found-canvas");
        ctx = canvas.getContext("2d");
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        particleCount = 150;
        particles = [];
        minDist = 70;
        dist = void 0;
        i = 0;
        while (i < particleCount) {
          particles.push(new Particle());
          i++;
        }
        return animloop();
      };

      return PageNotFoundView;

    })(View);

    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
    })();

    paintCanvas = function() {
      ctx.fillStyle = $('body').css('background-color');
      return ctx.fillRect(0, 0, W, H);
    };

    Particle = function() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = -1 + Math.random() * 2;
      this.vy = -1 + Math.random() * 2;
      this.radius = 4;
      this.draw = function() {
        ctx.fillStyle = "rgb(" + constants.styles.color_rgb + ")";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        return ctx.fill();
      };
    };

    draw = function() {
      var p;
      i = void 0;
      p = void 0;
      paintCanvas();
      i = 0;
      while (i < particles.length) {
        p = particles[i];
        p.draw();
        i++;
      }
      return update();
    };

    update = function() {
      var j, p, p2, _results;
      i = void 0;
      j = void 0;
      p = void 0;
      p2 = void 0;
      _results = void 0;
      i = 0;
      _results = [];
      while (i < particles.length) {
        p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x + p.radius > W) {
          p.x = p.radius;
        } else {
          if (p.x - p.radius < 0) p.x = W - p.radius;
        }
        if (p.y + p.radius > H) {
          p.y = p.radius;
        } else {
          if (p.y - p.radius < 0) p.y = H - p.radius;
        }
        j = i + 1;
        while (j < particles.length) {
          p2 = particles[j];
          distance(p, p2);
          j++;
        }
        _results.push(i++);
      }
      return _results;
    };

    distance = function(p1, p2) {
      var ax, ay, dx, dy;
      ax = void 0;
      ay = void 0;
      dist = void 0;
      dx = void 0;
      dy = void 0;
      dist = void 0;
      dx = p1.x - p2.x;
      dy = p1.y - p2.y;
      dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= minDist) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(" + constants.styles.color_rgb + "," + (1.2 - dist / minDist) + ")";
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();
        ax = dx / 2000;
        ay = dy / 2000;
        p1.vx -= ax;
        p1.vy -= ay;
        p2.vx += ax;
        return p2.vy += ay;
      }
    };

    animloop = function() {
      draw();
      if ($('#page-not-found-canvas').length) return requestAnimFrame(animloop);
    };

    module.exports = PageNotFoundView;

  }).call(this);
  
}});

window.require.define({"views/templates/404": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<header class=\"jumbotron subhead page-not-found-header\" id=\"overview\">\n    <h1>Page not found</h1>\n    <p class=\"lead\">Hmmmm... didn't work out like you'd hoped?</p>\n    <p class=\"lead\"><a href=\"\">Take me home</a></p>\n</header>\n\n<div id=\"msspm-web\">\n    <canvas id=\"page-not-found-canvas\"></canvas>\n</div>";});
}});

window.require.define({"views/templates/modal": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "id=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"";
    return buffer;}

  function program3(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n            <a href=\"";
    foundHelper = helpers.href;
    stack1 = foundHelper || depth0.href;
    stack2 = helpers['if'];
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(6, program6, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\" class=\"";
    foundHelper = helpers['class'];
    stack1 = foundHelper || depth0['class'];
    stack2 = helpers['if'];
    tmp1 = self.program(8, program8, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(10, program10, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\" ";
    foundHelper = helpers.close;
    stack1 = foundHelper || depth0.close;
    stack2 = helpers['if'];
    tmp1 = self.program(12, program12, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += ">";
    foundHelper = helpers.text;
    stack1 = foundHelper || depth0.text;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "text", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a>\n        ";
    return buffer;}
  function program4(depth0,data) {
    
    var stack1;
    foundHelper = helpers.href;
    stack1 = foundHelper || depth0.href;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "href", { hash: {} }); }
    return escapeExpression(stack1);}

  function program6(depth0,data) {
    
    
    return "#";}

  function program8(depth0,data) {
    
    var stack1;
    foundHelper = helpers['class'];
    stack1 = foundHelper || depth0['class'];
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "class", { hash: {} }); }
    return escapeExpression(stack1);}

  function program10(depth0,data) {
    
    
    return "btn";}

  function program12(depth0,data) {
    
    
    return "data-dismiss=\"modal\"";}

    buffer += "<div class=\"modal\" ";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += ">\n    <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\">×</button>\n        <h3>";
    foundHelper = helpers.header;
    stack1 = foundHelper || depth0.header;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "header", { hash: {} }); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "</h3>\n    </div>\n    <div class=\"modal-body\">\n        ";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n    </div>\n    <div class=\"modal-footer\">\n        ";
    foundHelper = helpers.buttons;
    stack1 = foundHelper || depth0.buttons;
    foundHelper = helpers.eachWithFn;
    stack2 = foundHelper || depth0.eachWithFn;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n    </div>\n</div>";
    return buffer;});
}});

window.require.define({"vine": function(exports, require, module) {
  (function() {
    var vine;

    vine = {};

    vine.video_length = 6.5 * 1000;

    vine.start_cycle_vine = function() {
      vine.current_index = 0;
      vine.cycle_vine();
      clearInterval(vine.cycle_vine_interval);
      return vine.cycle_vine_interval = setInterval(vine.cycle_vine, vine.video_length * 3);
    };

    vine.cycle_vine = function() {
      $('.vine-iframe-wrapper iframe').each(function() {
        return $(this).attr('src', vine.url_list[vine.current_index]);
      });
      vine.current_index = (vine.current_index + 1) % vine.url_list.length;
      if (vine.current_index >= vine.url_list.length) return vine.load_vines();
    };

    vine.load_vines = function() {
      var i, j, url;
      i = void 0;
      j = void 0;
      url = void 0;
      vine.url_list = [];
      vine.url_dict = {};
      return $.getJSON('http://search.twitter.com/search.json?q=' + vine.get_search_query() + '&rpp=100&include_entities=true&result_type=mixed&callback=?', function(data) {
        i = 0;
        while (i < data.results.length) {
          j = 0;
          while (j < data.results[i].entities.urls.length) {
            url = data.results[i].entities.urls[j].expanded_url;
            if (url.indexOf('vine.co/v/') > -1) {
              if (!vine.url_dict[url]) {
                vine.url_list.push(url + '/embed/postcard');
                vine.url_dict[url] = true;
              }
            }
            j++;
          }
          i++;
        }
        return vine.start_cycle_vine();
      });
    };

    vine.get_search_query = function() {
      return 'vine.co+' + $('.vine-hash-input').val().replace('#', '').replace(new RegExp(' ', 'g'), '+');
    };

    vine.setup_search = function() {
      return $('.vine-hash-input').keyup(function(e) {
        if (e.keyCode === 13) return vine.load_vines();
      });
    };

    vine.setup_vine_autoplay = function() {
      return $('.vine-iframe-wrapper iframe').load(function() {
        return this.contentWindow.postMessage('play', '*');
      });
    };

    vine.init = function() {
      vine.setup_search();
      vine.setup_vine_autoplay();
      return vine.load_vines();
    };

    module.exports = vine;

  }).call(this);
  
}});

