
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
    
    import React from "react";
    import { unmountComponentAtNode } from "react-dom";
    import { render,screen, within } from '@testing-library/react'
    import { act } from "react-dom/test-utils";
    import PasswordPolicy from "./PasswordPolicy";
    import PasswordPolicyTable from "./PasswordPolicy";
    
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

it("for passing data", async () => {
    const passwordPolicy = [
    {
    "policyId" : 1,
    "policyName" : "policy1",
    "maxFailAttempts" : 5,
    "passExpDays" : 30,
    "minLength" : 6,
    "minDigits" : 1,
    "minSplChar" : 1,
    "minUpperChar" : 1,
    "minLowerChar" : 1,
    "numMultLogin" : 2,
    "numOldPass" : 1,
    "minReuseDays" : 20,
    },
    {
    "policyId" : 2,
    "policyName" : "policy2",
    "maxFailAttempts" : 3,
    "passExpDays" : 20,
    "minLength" : 8,
    "minDigits" : 2,
    "minSplChar" : 1,
    "minUpperChar" : 2,
    "minLowerChar" : 2,
    "numMultLogin" : 3,
    "numOldPass" : 2,
    "minReuseDays" : 15,
    
    }];

    const {getByRole, getByText} = render(
    <PasswordPolicyTable passwordPolicy={passwordPolicy}/>, container);
    
    expect(getByRole('rowgroup')).not.toBeNull();
    });