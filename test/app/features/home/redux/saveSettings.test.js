import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  SAVE_SETTINGS_BEGIN,
  SAVE_SETTINGS_SUCCESS,
  SAVE_SETTINGS_FAILURE,
  SAVE_SETTINGS_DISMISS_ERROR,
} from 'features/home/redux/constants';

import {
  saveSettings,
  dismissSaveSettingsError,
  reducer,
} from 'features/home/redux/saveSettings';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/saveSettings', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('action should handle saveSettings success', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: SAVE_SETTINGS_BEGIN },
      { type: SAVE_SETTINGS_SUCCESS, data: {} },
    ];

    return store.dispatch(saveSettings({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle saveSettings failure', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: SAVE_SETTINGS_BEGIN },
      { type: SAVE_SETTINGS_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(saveSettings({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle dismissSaveSettingsError', () => {
    const expectedAction = {
      type: SAVE_SETTINGS_DISMISS_ERROR,
    };
    expect(dismissSaveSettingsError()).to.deep.equal(expectedAction);
  });

  it('reducer should handle SAVE_SETTINGS_BEGIN', () => {
    const prevState = { saveSettingsPending: true };
    const state = reducer(
      prevState,
      { type: SAVE_SETTINGS_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveSettingsPending).to.be.true;
  });

  it('reducer should handle SAVE_SETTINGS_SUCCESS', () => {
    const prevState = { saveSettingsPending: true };
    const state = reducer(
      prevState,
      { type: SAVE_SETTINGS_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveSettingsPending).to.be.false;
  });

  it('reducer should handle SAVE_SETTINGS_FAILURE', () => {
    const prevState = { saveSettingsPending: true };
    const state = reducer(
      prevState,
      { type: SAVE_SETTINGS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveSettingsPending).to.be.false;
    expect(state.saveSettingsError).to.exist;
  });

  it('reducer should handle SAVE_SETTINGS_DISMISS_ERROR', () => {
    const prevState = { saveSettingsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SAVE_SETTINGS_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveSettingsError).to.be.null;
  });
});
