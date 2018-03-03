import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { BatchAddCmds } from 'src/features/home/BatchAddCmds';

describe('home/BatchAddCmds', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <BatchAddCmds {...props} />
    );

    expect(
      renderedComponent.find('.home-batch-add-cmds').getElement()
    ).to.exist;
  });
});
