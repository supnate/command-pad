import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ColResizer } from 'src/features/home/ColResizer';

describe('home/ColResizer', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ColResizer {...props} />
    );

    expect(
      renderedComponent.find('.home-col-resizer').getElement()
    ).to.exist;
  });
});
