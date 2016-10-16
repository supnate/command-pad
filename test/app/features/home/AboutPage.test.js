import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { AboutPage } from 'features/home/AboutPage';

describe('home/AboutPage', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AboutPage {...pageProps} />
    );

    expect(
      renderedComponent.find('.home-about-page').node
    ).to.exist;
  });
});
