import React from 'react';
import FaultTable from './Fault';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { useLocation } from 'react-router-dom';

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

jest.mock('../widgets/Breadcrumb', () => {
    
    let location = useLocation();
	const path = location.pathname;
	const results = path.split('/');
	return(
		<Fragment>
			<Breadcrumb>
				<Breadcrumb.Section>Home</Breadcrumb.Section>
				{results.map((result,index) => (
					<Fragment>
						<Breadcrumb.Section>{result}</Breadcrumb.Section>
						<Breadcrumb.Divider />
					</Fragment>
				))}
			</Breadcrumb>
		</Fragment>
	)
});

let container = null;
beforeEach(()  => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("renders data", () => {
    act(() => {
        render(<FaultTable/>,container);
    });
    expect(container.textContent).toBe("FaultId");
});
 