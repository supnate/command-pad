import {
  SAVE_SETTINGS_BEGIN,
  SAVE_SETTINGS_SUCCESS,
  SAVE_SETTINGS_FAILURE,
  SAVE_SETTINGS_DISMISS_ERROR,
} from './constants';

export function saveSettings(args) {
  return (dispatch) => {
    dispatch({
      type: SAVE_SETTINGS_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (!args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: SAVE_SETTINGS_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: SAVE_SETTINGS_FAILURE,
            data: {
              error: 'some error',
            },
          });
          reject();
        }
      }, 50);
    });

    return promise;
  };
}

export function dismissSaveSettingsError() {
  return {
    type: SAVE_SETTINGS_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case SAVE_SETTINGS_BEGIN:
      return {
        ...state,
        saveSettingsPending: true,
        saveSettingsError: null,
      };

    case SAVE_SETTINGS_SUCCESS:
      return {
        ...state,
        saveSettingsPending: false,
        saveSettingsError: null,
      };

    case SAVE_SETTINGS_FAILURE:
      return {
        ...state,
        saveSettingsPending: false,
        saveSettingsError: action.data.error,
      };

    case SAVE_SETTINGS_DISMISS_ERROR:
      return {
        ...state,
        saveSettingsError: null,
      };

    default:
      return state;
  }
}
