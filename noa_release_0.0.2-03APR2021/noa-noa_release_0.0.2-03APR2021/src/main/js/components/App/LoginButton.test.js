import React from 'react';
import { shallow } from 'enzyme';
import Button from './Login';

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


  it('Test click event', () => {
    const mockCallBack = jest.fn();

    const button = shallow(( <Button  onClick={() => login(this.state.user, this.setRedirect)}>Login</Button>));
    button.find('button').simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
