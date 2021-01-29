// req와 ajax가 안 묶여있으면, ajax 객체 외의 다른 상황에서도 req가 쓰일 위험이 있음.
// 따라서 클로저를 이용해서 정보 은폐를 해야 함!
const ajax = (() => {
  const req = (method, url, payload) => {
    return new Promise((resolve, rejected) => {
      const xhr = new XMLHttpRequest();
  
      xhr.open(method, url);
  
      xhr.setRequestHeader('content-type', 'application/json');
      // payload가 없을 때 붙여줘도 아무 문제 없음.
  
      xhr.send(JSON.stringify(payload));
  
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) resolve(JSON.parse(xhr.response));
        else rejected(new Error(xhr.status));
      };
    });
  };

  return {
    get(url, resolve) {
      return req('GET', url);
      // 프로미스를 반환해줘야 app.js에서 후속 처리 메서드를 사용할 수 있음.
      // return문 없으면 get 메서드의 반환값으로 프로미스를 받을 수 없음.
    },
    post(url, payload, resolve) {
      return req('POST', url, payload);
    },
    patch(url, payload, resolve) {
      return req('PATCH', url, payload);
    },
    delete(url, resolve) {
      return req('DELETE', url);
    }
  };
})();

// ajax.get('/todos', console.log, console.error);

export default ajax;
// 파일 스코프 밖에서도 참조할 수 있도록 export
// 하나만 내보내는 게 좋음.
