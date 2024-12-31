let date = new Date();
const monthArr = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const dates = document.querySelector('.dates');
const header = document.querySelector('.header');
const todoContainer = document.querySelector('.todo');
const todoList = document.querySelector('.list');
const addTodo = document.querySelector('.add-todo');
let currentDate;
let isSelectDay = false;

let todoDataBase;
if(localStorage.getItem('todo') === null){
  todoDataBase = {};
} else {
  todoDataBase = JSON.parse(localStorage.getItem('todo'));
}

const updateLocalStorage = () => {
  localStorage.setItem('todo', JSON.stringify(todoDataBase));
}

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

const createTodo = (todo) => {
  const li = document.createElement('li');
  const checkBox = document.createElement('div');
  const deleteBox = document.createElement('div');
  const p = document.createElement('p');

  if(todo.check)
    checkBox.classList.add('checkbox', 'check');
  else
    checkBox.classList.add('checkbox');
  
  li.dataset.todoId = todo.todoId;
  deleteBox.classList.add('deletebox')
  p.textContent = todo.content;
  
  li.append(checkBox);
  li.append(p);
  li.append(deleteBox);
  todoList.append(li);
}

dates.addEventListener('click', (e) => {
  if(e.target.tagName !== "SPAN")
    return
  
  currentDate = e.target.dataset.date.split("-");

  if(e.target.className.includes('current')){
    e.target.classList.remove('current')
    isSelectDay = false
  } else {
    dates.childNodes.forEach((date) => {
      date.firstChild.classList.remove('current');
    })
    e.target.classList.add('current');
    isSelectDay = true
  }

  if(isSelectDay){
    todoContainer.style.display = "block";
    todoList.innerHTML = "";
    const [year, month, date] = currentDate;
    
    if(
      todoDataBase[year] &&
      todoDataBase[year][month] &&
      todoDataBase[year][month][date]
    ) {
      todoDataBase[year][month][date].forEach((todo) => {
        createTodo(todo);
      })
    }
  }
  else 
    todoContainer.style.display = "none";
})

todoList.addEventListener('click', (e) => {
  if(e.target.tagName !== "DIV" && e.target.tagName !== "P")
    return;
  
  const todoId = e.target.parentElement.dataset.todoId;
  const [year, month, date] = currentDate;

  if(e.target.className.includes('checkbox')){
    e.target.classList.toggle('check');
  
    todoDataBase[year][month][date].forEach((data)=>{
      if(data.todoId.toString() === todoId)
        data.check= !data.check;
    })

    updateLocalStorage();
  } else if(e.target.className.includes('deletebox')){
    const temp = todoDataBase[year][month][date].filter((data) => {
      return data.todoId.toString() !== todoId
    })
    todoDataBase[year][month][date] = temp;
    updateLocalStorage();
    todoList.innerHTML = "";
    todoDataBase[year][month][date].forEach((todo) => {
      createTodo(todo);
    })
  } else if(e.target.tagName === "P") {
    const isChecked = [...e.target.previousElementSibling.classList].includes('check');
    if(isChecked)
      return;

    const input = document.createElement('input');
    input.value = e.target.textContent;
    e.target.parentElement.replaceWith(input);
    input.focus()

    const modifyTodo = (e) => {
      // if(isWrite)
      //   return;
      if(e.type === "keydown" && e.code !== "Enter")
        return;
      
      todoDataBase[year][month][date].forEach((todo) => {
        if(todo.todoId.toString() === todoId){
          todo.content = e.target.value;
          updateLocalStorage();
        }
      })

      const li = document.createElement('li');
      const checkBox = document.createElement('div');
      const deleteBox = document.createElement('div');
      const p = document.createElement('p');

      checkBox.classList.add('checkbox');
      li.dataset.todoId = todoId;
      deleteBox.classList.add('deletebox')
      p.textContent = e.target.value;
      
      li.append(checkBox);
      li.append(p);
      li.append(deleteBox);
      input.replaceWith(li);
    }

    input.addEventListener('keydown', modifyTodo);
  }
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
    const [year, month, date] = currentDate;
    const todoId = Date.now();

    if(!todoDataBase[year])
      todoDataBase[year] = {};
    if(!todoDataBase[year][month])
      todoDataBase[year][month] = {};
    if(!todoDataBase[year][month][date])
      todoDataBase[year][month][date] = [];
    
    const todoObj = {
      todoId: todoId,
      check: false,
      content: todoInput.value
    }

    todoDataBase[year][month][date].push(todoObj);
    updateLocalStorage();

    createTodo(todoObj);
    todoInput.remove();
  }

  todoInput.addEventListener('focusout', writeTodo);
  todoInput.addEventListener('keydown', writeTodo);
})