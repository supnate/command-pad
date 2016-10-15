import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Welcome } from 'src/features/home';

describe('home/Welcome', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Welcome />
    );

    expect(
      renderedComponent.find('.home-welcome').node
    ).to.exist;
  });
});
