import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ConsoleOutput } from 'src/features/home';

describe('home/ConsoleOutput', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <ConsoleOutput />
    );

    expect(
      renderedComponent.find('.home-console-output').node
    ).to.exist;
  });
});
