# Todos v4.0으로 REST API 연습하기

#### Express로 만든 페이크 서버와 모듈을 활용하여 Todos v4.0을 만들어보자.
##### JSON 서버 대신 페이크 서버를 활용하는 이유
- JSON 서버에서는 벌크 패치(한 번의 요청만으로 데이터를 일률적으로 패치 및 삭제해주는 것)를 지원하지 않는다.
- Express로 페이크 서버를 만들면 벌크 패치를 직접 구현할 수 있다.
- Todos 예제에서도 벌크 패치가 필요하므로, JSON 서버만으로 Todos v4.0을 만드는 데에는 한계가 있어 Express 페이크 서버를 만들고 실습하기로 한다.
  - Todos 예제에서 벌크 패치가 필요한 기능은 ①Mark all as complete과 ②Clear completed이다.
##### 실습 준비하기(요약)
- Express를 설치하며 생성해놓은 public 루트 디렉토리에 `index.html`, `css/style.css`, `js/app.js`, `js/xhr.js` 파일을 위치시킨다.
  - 이하의 과정을 시작하기 전 `index.html`, `style.css`, `xhr.js` 파일은 완전히 작성된 상태여야 한다.
- `xhr.js`의 `ajax` 객체를 `export`시킨다.
  ```js
  export default ajax;
  ```
- `app.js`에서 이를 `import`한다.
  ```js
  import ajax from './xhr.js';
  ```
- `index.html`에서 `<script>` 태그로 `app.js` 파일을 로드해온다.
  ```html
    <script type="module" src="js/app.js"></script>
  ```
- 페이크 서버를 켜고 모듈 연결이 정상적으로 되는지 확인한 뒤 `app.js` 파일의 코드 작성을 시작한다. 😊
