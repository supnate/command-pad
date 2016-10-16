import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CmdList } from 'src/features/home';

describe('home/CmdList', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <CmdList />
    );

    expect(
      renderedComponent.find('.home-cmd-list').node
    ).to.exist;
  });
});
