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
      // 📌여기까지는 동기처리이므로 프로미스 생성자 함수 밖에 둬도 상관은 없지만,
      // onload까지가 하나의 처리이기 때문에 하나의 몸체 안에 두는 것이 바람직함.
  
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) resolve(JSON.parse(xhr.response));
        else rejected(new Error(xhr.status));
      };
    });
  };

  return {
    get(url) {
      return req('GET', url);
      // 프로미스를 반환해줘야 app.js에서 후속 처리 메서드를 사용할 수 있음.
      // return문 없으면 get 메서드의 반환값으로 프로미스를 받을 수 없음.
    
      // 📌get 함수가 단순히 어떤 작업을 하는 거로 끝내도 되면 (기존의 xhr.js처럼)
      // 굳이 결과값을 반환하지 않아도 되겠지만,
      // 이 경우의 get 함수는 후속 처리 메서드를 위한 프로미스를 "반환해야" 하므로
      // return문을 작성해주어야 하는 것!!
    },
    post(url, payload) {
      return req('POST', url, payload);
    },
    patch(url, payload) {
      return req('PATCH', url, payload);
    },
    delete(url) {
      return req('DELETE', url);
    }
  };
})();

// ajax.get('/todos', console.log, console.error);

export default ajax;
// 파일 스코프 밖에서도 참조할 수 있도록 export
// 하나만 내보내는 게 좋음.
