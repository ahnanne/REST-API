// const isDuplicated = id => todos.map(todo => todo.id).includes(id);
// todos에 의존하는 비순수 함수
// 모듈 사용 시 비순수 함수는 테스트하기가 까다로워짐.

// 그래서 아래와 같이 수정
const isDuplicated = (array, id) => array.map(item => item.id).includes(id);

export default isDuplicated;
