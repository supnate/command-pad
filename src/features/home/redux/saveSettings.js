import {
  SAVE_SETTINGS_BEGIN,
  SAVE_SETTINGS_SUCCESS,
  SAVE_SETTINGS_FAILURE,
  SAVE_SETTINGS_DISMISS_ERROR,
} from './constants';

export function saveSettings(data) {
  return (dispatch) => {
    dispatch({
      type: SAVE_SETTINGS_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      bridge.ipcRenderer.once('SAVE_SETTINGS_SUCCESS', (evt) => {
        dispatch({
          type: SAVE_SETTINGS_SUCCESS,
          data,
        });
        resolve();
      });

      bridge.ipcRenderer.send('SAVE_SETTINGS', data);
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
        envPath: action.data.envPath,
        outputRowsLimit: parseInt(action.data.outputRowsLimit, 10),
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
