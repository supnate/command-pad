import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { StatusPage } from 'features/home/StatusPage';

describe('home/StatusPage', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <StatusPage {...pageProps} />
    );

    expect(
      renderedComponent.find('.home-status-page').node
    ).to.exist;
  });
});
