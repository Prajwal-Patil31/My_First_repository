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
    
    jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    
    return {
    __esModule: true,
    ...originalModule,
    useNavigate: jest.fn(),
    useLocation: jest.fn().mockReturnValue({ pathname: 'Home/security/polcies-password'}),
    };
    });
    
    // user.test.js
    
    import React from "react";
    import { render, unmountComponentAtNode } from "react-dom";
    import { act } from "react-dom/test-utils";
    import Login from "./Login";
    import User from "./user";
    
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
    
    test('should submit when form inputs contain text', async () => {
    const { getByTestId, queryByText } = render(<Login/>)
    
    await act(async () => {
    fireEvent.change(screen.getByLabelText(/username/i), {
    target: {value: 'admin'},
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
    target: {value: 'pass'},
    })
    });
    
    await act (async () => {
    fireEvent.submit(getByText('Login'))
    });
    act(() => {
    render(<Login />, container);
    });
    expect(queryByText("User Name")).toBeInTheDocument();
    expect(queryByText("Password")).toBeInTheDocument();
    expect(container.textContent).toBe("Username Password forgotpassword");
    //render(/login);
    });
