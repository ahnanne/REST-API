// module
import ajax from './app27';

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

  // 조회 중인 탭별 렌더링
  /*
  const _todos = todos.filter(todo => {
    if (navState === 'All') return true;
    else if (navState === 'Active') return !todo.completed;

    return todo.completed;
  });
  */
  // 위 코드를 삼항 조건 연산자를 사용하여 바꿔보면 아래와 같음.
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

// 데이터를 ID순으로 정렬
const sortData = () => {
  todos.sort((todo1, todo2) => todo2.id - todo1.id);
};

// 가장 먼저 데이터 fetch 해오기 (GET)
// ajax 객체
const fetchTodos = () => {
  // TODO: 데이터 취득(잠정 처리)
  ajax.get('/todos', _todos => {
    todos = _todos;
    render();
  });
  // sortData();
};

// 새로운 ID 생성 함수
const generateId = () => {
  let maxId = -Infinity;

  if (todos[0] === undefined) return 1;
  todos.forEach(todo => {
    if (todo.id > maxId) maxId = todo.id;
  });

  return maxId + 1;
};

// 새로운 todo 추가하기 (POST)
const addTodo = content => {
  ajax.post('/todos', {
    id: generateId(),
    content,
    completed: false
  },
  newTodo => {
    todos = [newTodo, ...todos];
    render();
  });
  // 여기서 render() 하는 것은 동기식 발상
  // ajax.post는 비동기 함수인바 여기 있는 함수가 ajax.post보다 먼저 실행이 됨.
};

// 체크박스 체크 여부에 따라 데이터 갱신하기 (PATCH)
const toggleCompleted = targetId => {
  const { completed } = todos.find(todo => todo.id === +targetId);
  ajax.patch(`/todos/${targetId}`, { completed: !completed }, updatedTodo => {
    todos = todos.map(todo => todo.id === +targetId ? updatedTodo : todo);
  });

  render();
};

// todo 삭제하기 (DELETE)
const removeTodo = targetId => {
  ajax.delete(`/todos/${targetId}`, () => {
    todos = todos.filter(todo => todo.id !== +targetId);
    render();
  });
  todos = todos.filter(todo => todo.id !== +targetId);

  render();
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

// 🎈Mark all as complete (PATCH)
const markAllck = () => {
  todos = todos.map(todo => ({
    ...todo,
    completed: true
  }));

  render();
};

// Clear completed (DELETE)
const clearCompleted = () => {
  todos = todos.filter(todo => todo.completed !== true);

  render();
};

// 💚 이벤트 핸들러 등록 모음
// 가장 먼저 데이터 fetch 해오기
document.addEventListener('DOMContentLoaded', fetchTodos());

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
};

// todo 삭제하기(이벤트 위임)
$todos.onclick = e => {
  if (e.target.matches('i')) removeTodo(e.target.parentNode.getAttribute('id'));
};

// 탭별 item 조회하기(navState 변경하기)
$nav.onclick = e => {
  if (e.target === e.currentTarget) return;
  changeNavState(e.target, e.target.classList);

  if ($ckAll.checked) $ckAll.checked = false;
};

// Mark all as complete
$ckAll.onchange = () => {
  markAllck();
};

// Clear completed
$clearBtn.onclick = () => {
  clearCompleted();

  if ($ckAll.checked) $ckAll.checked = false;
};
