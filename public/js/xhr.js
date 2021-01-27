// req와 ajax가 안 묶여있으면, ajax 객체 외의 다른 상황에서도 req가 쓰일 위험이 있음.
// 따라서 클로저를 이용해서 정보 은폐를 해야 함!
const ajax = (() => {
  const req = (method, url, callback, payload) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.setRequestHeader('content-type', 'application/json');
    // payload가 없을 때 붙여줘도 아무 문제 없음.

    xhr.send(JSON.stringify(payload));

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) callback(JSON.parse(xhr.response));
      else console.error(xhr.status);
    };
  };

  return {
    get(url, callback) {
      req('GET', url, callback);
    },
    post(url, payload, callback) {
      req('POST', url, callback, payload);
    },
    patch(url, payload, callback) {
      req('PATCH', url, callback, payload);
    },
    delete(url, callback) {
      req('DELETE', url, callback);
    }
  };
})();

// ajax.get('/todos', console.log, console.error);

export default ajax;
// 파일 스코프 밖에서도 참조할 수 있도록 export
// 하나만 내보내는 게 좋음.
