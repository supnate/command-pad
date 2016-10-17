import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { SettingsPage } from 'features/home/SettingsPage';

describe('home/SettingsPage', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <SettingsPage {...pageProps} />
    );

    expect(
      renderedComponent.find('.home-settings-page').node
    ).to.exist;
  });
});
