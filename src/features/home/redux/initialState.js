const initialState = {
  getInitDataPending: false,
  getInitDataError: null,
  saveCmdPending: false,
  saveCmdError: null,
  deleteCmdPending: false,
  deleteCmdError: null,
  reorderCmdsPending: false,
  reorderCmdsError: null,
  runCmdPending: false,
  runCmdError: null,
  saveSettingsPending: false,
  saveSettingsError: null,
  clearOutputPending: false,
  clearOutputError: null,
  colWidth: 200,
  selectedCmd: null,
};

export default initialState;
