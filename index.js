let date = new Date();
const monthArr = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const dates = document.querySelector('.dates');
const header = document.querySelector('.header');
const todoContainer = document.querySelector('.todo');
const todoList = document.querySelector('.list');
const addTodo = document.querySelector('.add-todo');
let isSelectDay = false;

const render = () => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  document.querySelector('.year').textContent = currentYear;
  document.querySelector('.month').textContent = monthArr[currentMonth];

  const prevLast = new Date(currentYear, currentMonth, 0);
  const thisLast = new Date(currentYear, currentMonth + 1, 0);

  const prevLastDate = prevLast.getDate();
  const prevLastDay = prevLast.getDay();

  const thisLastDate = thisLast.getDate();
  const thisLastDay = thisLast.getDay();

  const createDateCell = (date, relativeMonth) => {
    const count = relativeMonth ==="prev" 
                ? -1 
                : relativeMonth === "next" 
                ? 1
                : 0;
    
    const _date = new Date(currentYear, currentMonth + count);

    const div = document.createElement('div');
    const span = document.createElement('span');

    div.classList.add('cell');
    span.dataset.date = `${_date.getFullYear()}-${_date.getMonth()+1}-${date}`;
    span.textContent = date;
    
    div.append(span);
    return div;
  } 

  const prevDateArr = [];
  const thisDateArr = [];
  const nextDateArr = [];

  if(prevLastDay !== 6)
    for(let i=0; i<prevLastDay+1; i++)
      prevDateArr.unshift(createDateCell(prevLastDate - i, "prev"));
  
  for(let i=0; i<thisLastDate; i++)
    thisDateArr[i] = createDateCell(i+1);

  for(let i=1; i<7-thisLastDay; i++)
    nextDateArr.push(createDateCell(i, "next"));

  const dateArr = prevDateArr.concat(thisDateArr, nextDateArr);
  const prevDateIndex = dateArr.findIndex(element => element.textContent  === "1");
  const nextDateIndex = dateArr.findLastIndex(element => element.textContent === `${thisLastDate}`);

  dateArr.forEach((date, i) => {
    const dateType = i >= prevDateIndex && i < nextDateIndex + 1
                  ? 'this'
                  : 'other';

    date.firstChild.classList.add(dateType);
                    
    dates.append(date);
  })
}

render();

const monthNavigator = (keyword) => {
  date.setDate(1);
  const monthAction = {
    "prev-month": () => {
      date.setMonth(date.getMonth() - 1);
    },
    "next-month": () => {
      date.setMonth(date.getMonth() + 1);
    }
  }

  if(!monthAction[keyword])
    return

  monthAction[keyword]();
  dates.innerHTML = "";
  render()
}

header.addEventListener('click', (e) => {
  if(e.target.tagName !== "BUTTON")
    return;
  
  const targetMonth = [...e.target.classList].pop();
  monthNavigator(targetMonth);
})

dates.addEventListener('click', (e) => {
  if(e.target.tagName !== "SPAN")
    return

  if(e.target.className.includes('current')){
    e.target.classList.remove('current')
    isSelectDay = false
  }
  else {
    dates.childNodes.forEach((date) => {
      date.firstChild.classList.remove('current');
    })
    e.target.classList.add('current');
    isSelectDay = true
  }

  if(isSelectDay)
    todoContainer.style.display = "block";
  else 
    todoContainer.style.display = "none";
})

todoList.addEventListener('click', (e) => {
  if(e.target.tagName !== "DIV")
    return;
  e.target.classList.toggle('check');
});



addTodo.addEventListener('click', () => {

  const todoInput = document.createElement('input');
  todoList.append(todoInput);
  todoInput.focus();
  
  let isWrite = false;
  const writeTodo = (e) => {
    if(isWrite)
      return;
    if(e.type === "keydown" && e.code !== "Enter")
      return;
    if(todoInput.value === ""){
      todoInput.remove();
      return;
    }
    isWrite = !isWrite

    const li = document.createElement('li');
    const div = document.createElement('div');
    const p = document.createElement('p');

    div.classList.add('checkbox');
    p.textContent = todoInput.value;

    li.append(div);
    li.append(p);
    todoList.append(li);
    todoInput.remove();
  }

  todoInput.addEventListener('focusout', writeTodo);
  todoInput.addEventListener('keydown', writeTodo);
})




