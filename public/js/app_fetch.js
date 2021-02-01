import req from './fetch.js';

// global
let todos = [];
let navState = 'All';

// 💚 요소 노드 취득 모음
const $todos = document.querySelector('ul.todos');
const $input = document.querySelector('.input-todo');
const $numOfCompleted = document.querySelector('span.completed-todos');
const $numOfActive = document.querySelector('strong.active-todos');
const $nav = document.querySelector('.nav');
const $ckAll = document.getElementById('ck-complete-all');
const $clearBtn = document.querySelector('.clear-completed > button.btn');

// 💚 이벤트 핸들러 모음
// item 개수 세기
const countNum = () => {
  let cnt = 0;
  let cntTodos = 0;

  // count completed
  todos.reduce((_, todo) => {
    if (todo.completed) return ++cnt;
    return cnt;
  }, 0);
  $numOfCompleted.textContent = cnt;

  // count active
  todos.reduce(() => ++cntTodos, 0);
  $numOfActive.textContent = cntTodos - cnt;
};

// 렌더링
const render = () => {
  let html = '';

  todos.sort((todo1, todo2) => todo2.id - todo1.id);

  // 조회 중인 탭별 렌더링
  const _todos = todos.filter(todo => navState === 'All' ? true : (navState === 'Active' ? !todo.completed : todo.completed));

  _todos.forEach(({
    id,
    content,
    completed
  }) => {
    html += `<li id="${id}" class="todo-item">
    <input id="ck-${id}" class="checkbox" type="checkbox" ${(completed ? 'checked' : '')} />
    <label for="ck-${id}">${content}</label>
    <i class="remove-todo far fa-times-circle"></i>
    </li>`;

    return html;
  });

  $todos.innerHTML = html;

  // item 개수 세기
  countNum();
};

const setTodos = _todos => {
  todos = _todos;
  render();
};

// 가장 먼저 데이터 fetch 해오기
const fetchTodos = () => {
  req.get('/todos')
    .then(response => response.json())
    .then(setTodos)
    .catch(console.error);
};

// 새로운 ID 생성 함수
const generateId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);

// 새로운 todo 추가하기
const addTodo = content => {
  req.post('/todos', {
    id: generateId(),
    content,
    completed: false
  })
    .then(response => response.json())
    .then(setTodos)
    .catch(console.error);
};

// 체크박스 체크 여부에 따라 데이터 갱신하기
const toggleCompleted = targetId => {
  const { completed } = todos.find(todo => todo.id === +targetId);
  // const completed = todos.find(todo => todo.id === +targetId).completed;
  req.patch(`/todos/${targetId}`, { completed: !completed })
    .then(response => response.json())
    .then(setTodos)
    .catch(console.error);
};

// todo 삭제하기
const removeTodo = targetId => {
  req.delete(`/todos/${targetId}`)
    .then(response => response.json())
    .then(setTodos)
    .catch(console.error);
};

// 탭별 item 조회하기(navState 변경하기)
const changeNavState = (tab, classlist) => {
  if (classlist.contains('active')) return;

  // change navState
  navState = tab.textContent;

  [...$nav.children].forEach(li => {
    li.classList.toggle('active', li === tab);
  });

  render();
};

// Mark all as complete
const markAllck = () => {
  req.patch('/todos', { completed: true })
    .then(response => response.json())
    .then(setTodos)
    .catch(console.error);
};

// Clear completed
const clearCompleted = () => {
  req.delete('/todos/completed')
    .then(response => response.json())
    .then(setTodos)
    .catch(console.error);
};

// 💚 이벤트 핸들러 등록 모음
// 가장 먼저 데이터 fetch 해오기
document.addEventListener('DOMContentLoaded', fetchTodos);

// 새로운 todo 추가하기
$input.onkeyup = e => {
  if (e.key !== 'Enter') return;

  addTodo(e.target.value);

  // 입력창 초기화
  e.target.value = '';

  if ($ckAll.checked) $ckAll.checked = false;
};

// 체크박스 체크 여부에 따라 데이터 갱신하기(이벤트 위임)
$todos.onchange = e => {
  toggleCompleted(e.target.parentNode.getAttribute('id'), e.target);
  if ($ckAll.checked) $ckAll.checked = false;
};

// todo 삭제하기(이벤트 위임)
$todos.onclick = e => {
  if (e.target.matches('i')) removeTodo(e.target.parentNode.getAttribute('id'));
  if ($ckAll.checked) $ckAll.checked = false;
};

// 탭별 item 조회하기(navState 변경하기)
$nav.onclick = e => {
  if (e.target === e.currentTarget) return;
  changeNavState(e.target, e.target.classList);

  if ($ckAll.checked) $ckAll.checked = false;
};

// Mark all as complete
$ckAll.onchange = e => {
  if (!e.target.checked) return;
  markAllck(e.target);
};

// Clear completed
$clearBtn.onclick = () => {
  clearCompleted();

  if ($ckAll.checked) $ckAll.checked = false;
};
