import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  GET_INIT_DATA_BEGIN,
  GET_INIT_DATA_SUCCESS,
  GET_INIT_DATA_FAILURE,
  GET_INIT_DATA_DISMISS_ERROR,
} from 'features/home/redux/constants';

import {
  getInitData,
  dismissGetInitDataError,
  reducer,
} from 'features/home/redux/getInitData';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getInitData', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('action should handle getInitData success', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: GET_INIT_DATA_BEGIN },
      { type: GET_INIT_DATA_SUCCESS, data: {} },
    ];

    return store.dispatch(getInitData({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle getInitData failure', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: GET_INIT_DATA_BEGIN },
      { type: GET_INIT_DATA_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(getInitData({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle dismissGetInitDataError', () => {
    const expectedAction = {
      type: GET_INIT_DATA_DISMISS_ERROR,
    };
    expect(dismissGetInitDataError()).to.deep.equal(expectedAction);
  });

  it('reducer should handle GET_INIT_DATA_BEGIN', () => {
    const prevState = { getInitDataPending: true };
    const state = reducer(
      prevState,
      { type: GET_INIT_DATA_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getInitDataPending).to.be.true;
  });

  it('reducer should handle GET_INIT_DATA_SUCCESS', () => {
    const prevState = { getInitDataPending: true };
    const state = reducer(
      prevState,
      { type: GET_INIT_DATA_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getInitDataPending).to.be.false;
  });

  it('reducer should handle GET_INIT_DATA_FAILURE', () => {
    const prevState = { getInitDataPending: true };
    const state = reducer(
      prevState,
      { type: GET_INIT_DATA_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getInitDataPending).to.be.false;
    expect(state.getInitDataError).to.exist;
  });

  it('reducer should handle GET_INIT_DATA_DISMISS_ERROR', () => {
    const prevState = { getInitDataError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: GET_INIT_DATA_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getInitDataError).to.be.null;
  });
});
