const isPlainObject = o => {
  if ((typeof o === 'object') && (o.constructor === Object)) return true;
};
const isEmpty = o => {
  if (Object.keys(o).length === 0) return true;
  // !Object.keys(o).length;
};

// 위에 두 함수는 아래 함수에 종속되어 있으므로, 아래 함수 하나만 export 해주면 됨.
const isEmptyObject = o => isPlainObject(o) && isEmpty(o);

export default isEmptyObject;
