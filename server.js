// express 서버 사용하여 페이크 서버 만들기
import express from 'express';
import cors from 'cors';

import isEmptyObject from './utils/isEmptyObject.js';
// ESM에서는 확장자명 생략하면 안됨! 생략해서 에러난 적 있음. 😭
import isDuplicated from './utils/isDuplicated.js';

// import todos from '.data/todos.js';
// "ESM 방식으로" import를 하면 기본적으로 다 const로 바뀜. 즉 read-only가 됨.
// 따라서 todos 데이터처럼 가공을 해서 변경시켜야 하는 데이터는 이렇게 모듈화하면 안됨.

// 모듈을 사용하므로 주석 처리한 부분은 필요 없음.
// const express = require('express');
// 교차 출처 리소스 공유(CORS) 방식
// const cors = require('cors');

let todos = [
  { id: 3, content: 'JS', completed: false },
  { id: 5, content: 'CSS', completed: true },
  { id: 1, content: 'HTML', completed: false }
];

// express는 함수이므로 호출 필요
const app = express();

// 교차 출처 리소스 공유(CORS) 방식
app.use(cors());

// 루트 디렉토리로 사용하고자 하는 폴더 지정
app.use(express.static('public'));

// JSON으로 body에 무엇인가 담겨오면 처리해주기 위함.
app.use(express.json());

// ✨이하는 요청 메서드(라우트) 모음 - 서버이므로 받는 입장!
app.get('/todos', (req, res) => {
  res.send(todos);
  // send 메서드 내부에서 자동으로 stringify하여 전달함.
});
// req 객체에는 우리가 서버에 request한 정보들이 들어있음.
// res 객체로는 서버가 클라이언트에게 response 처리를 함.

app.get('/todos/:id', (req, res) => {
  // 앞에 콜론(:)을 붙여주면 변수처럼 동작함.
  // 이때 id는 파라미터라고 부른다. (REST API)
  // console.log(req.params);
  // 포스트맨에서 요청 보내면 Node.js 환경에서 출력됨.
  res.send(todos.filter(todo => todo.id === +req.params.id));
  // send 메서드 내부에서 자동으로 stringify하여 전달함.
});

app.post('/todos', (req, res) => {
  // console.log(req.body);
  // 포스트맨에서 요청 보내면 Node.js 환경에서 출력됨.
  const newTodo = req.body;
  
  // 에러 처리 1 - id가 중복될 경우
  /*
  if (todos.find(todo => todo.id === +newTodo.id) !== undefined) {
    return res.send({
      error: true,
      reason: `${newTodo.id}는 이미 존재하는 id입니다.`
    });
  };
  */
  if (isDuplicated(todos, newTodo.id)) {
    return res.status(400).send({
      error: true,
      reason: `아이디 ${newTodo.id}이 중복되었습니다.`
    });
  }

  // 에러 처리 2 - payload를 전달받지 못한 경우
  // 빈 객체를 리턴함. => 빈 객체가 추가되므로 에러 처리 필요!
  // console.log(newTodo); // {}
  // 빈 객체인지를 확인해주는 함수 필요
  if (isEmptyObject(newTodo)) {
    return res.status(400).send({
      error: true,
      reason: '페이로드가 존재하지 않습니다.'
    });
  }
  
  // else
  todos = [req.body, ...todos];

  res.send(todos);
});

app.patch('/todos/:id', (req, res) => {
  const id = +req.params.id;
  // 랜선을 타고 오는 것들은 기본적으로 모두 string이므로 필요한 타입으로 변환해줘야 함.
  const completed = req.body;

  todos = todos.map(todo => todo.id === id ? {...todo, ...completed } : todo);
  res.send(todos);
  // 백엔드에서는 실패하는 경우에도 반드시 send를 해줘야 함. 안하면 에러!
});

// 벌크 패치 1 - 체크박스 토글
app.patch('/todos', (req, res) => {
  const completed = req.body;

  todos = todos.map(todo => ({ ...todo, ...completed }));
  res.send(todos);
});

// 벌크 패치 2 - 완료 항목 삭제
app.delete('/todos/completed', (req, res) => {
  // '/todos?completed=true'
  todos = todos.filter(todo => !todo.completed);
  res.send(todos);
});

app.delete('/todos/:id', (req, res) => {
  const id = +req.params.id;

  todos = todos.filter(todo => todo.id !== id);
  res.send(todos);
});


// 서버 기동 시키기
app.listen('7000', () => {
  console.log(`Server is listening on 'http://localhost:7000'`);
});
// 두 번째 인수로는 서버가 정상적으로 돌아가면 호출할 콜백 함수를 전달할 수 있음.