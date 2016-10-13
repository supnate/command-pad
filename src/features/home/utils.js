
export function findCmd(cmds, cmdId) {
  return cmds.find(c => c.id === cmdId);
}

export function replaceCmd(cmds, cmd) {
  const i = cmds.findIndex(c => c.id === cmd.id);
  const newCmds = [...cmds];
  newCmds.splice(i, 1, cmd);
  return newCmds;
}
