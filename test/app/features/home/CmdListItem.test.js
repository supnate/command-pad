import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CmdListItem } from 'src/features/home';

describe('home/CmdListItem', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <CmdListItem />
    );

    expect(
      renderedComponent.find('.home-cmd-list-item').node
    ).to.exist;
  });
});
