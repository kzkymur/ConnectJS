export const ActionTypes = {
  add: "ADD",
  delete: "DELETE",
  update: "UPDATE",

  undo: "UNDO",
  redo: "REDO",

  openCP: "OPENCP",
  closeCP: "CLOSECP",
  closeAllCP: "CLOSEALLCP",

  addConnection: "ADDCONNECTION",
  updateConnection: "UPDATECONNECTION",
  deleteConnection: "DELETECONNECTION",
} as const;
