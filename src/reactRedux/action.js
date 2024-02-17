export const funSelectCandidate = (data) => {
  return {
    type: "SELECTCANDIDATE",
    payload: data,
  };
};

export const funEdit = (data) => {
  return {
    type: "SETEDIT",
    payload: data,
  };
};

export const funLoading = (data) => {
  return {
    type: "SETLOADING",
    payload: data,
  };
};
