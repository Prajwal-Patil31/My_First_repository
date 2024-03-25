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
import { unmountComponentAtNode } from "react-dom";
import { render, screen } from '@testing-library/react'
import { act } from "react-dom/test-utils";
import { createMemoryHistory } from 'history'

import { Router } from 'react-router-dom'
import Breadcrumb from './Breadcrumb';

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("Renders Breadcrumb", () => {
    const history = createMemoryHistory()
    const route = '/security-users';
    history.push(route);
    render(
        <Router history={history}>
            <Breadcrumb />
        </Router>, container);
    expect(screen.getByTestId('location-display')).toHaveTextContent(route)
    
  });