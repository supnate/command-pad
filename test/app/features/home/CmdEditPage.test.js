import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CmdEditPage } from 'features/home/CmdEditPage';

describe('home/CmdEditPage', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <CmdEditPage {...pageProps} />
    );

    expect(
      renderedComponent.find('.home-cmd-edit-page').node
    ).to.exist;
  });
});
