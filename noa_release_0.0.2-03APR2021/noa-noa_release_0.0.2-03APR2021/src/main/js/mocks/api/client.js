
function uriTemplateInterceptor () {
    'use strict';
  
    const interceptor = require('rest/interceptor');
  
    return interceptor({
      request: function (request) {
        if (request.path.indexOf('{') === -1) {
          return request;
        } else {
          request.path = request.path.split('{')[0];
          return request;
        }
      }
    });
}

function uriListConverter () {
    'use strict';

	return {
		read: function(str) {
			return str.split('\n');
		},
		write: function(obj) {
			if (obj instanceof Array) {
				return obj.map(resource => resource._links.self.href).join('\n');
			} else {
				return obj._links.self.href;
			}
		}
	};
}

module.exports = {
	uriTemplateInterceptor : uriTemplateInterceptor,
  uriListConverter : uriListConverter
};