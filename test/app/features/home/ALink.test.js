import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ALink } from 'src/features/home';

describe('home/ALink', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <ALink />
    );

    expect(
      renderedComponent.find('.home-a-link').node
    ).to.exist;
  });
});
