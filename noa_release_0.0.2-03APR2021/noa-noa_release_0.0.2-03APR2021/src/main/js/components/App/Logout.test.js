// user.test.js
jest.mock('../../api/uriTemplateInterceptor', () => {
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
});

jest.mock('../../api/uriListConverter', () => {
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
});
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";
import ReactDOM from 'react-dom';
import App from './App';
import Logout from "./Logout";
let container = null;
beforeEach(() => {
// setup a DOM element as a render target
container = document.createElement("div");
document.body.appendChild(container);
});

afterEach(() => {
// cleanup on exiting
unmountComponentAtNode(container);
container.remove();
container = null;
});
test('renders without crashing', () => {

const div = document.createElement('div');
ReactDOM.render(<Logout/>, div);
ReactDOM.unmountComponentAtNode(div);
});