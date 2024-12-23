let date = new Date();
const month = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const dates = document.querySelector('.dates');
const header = document.querySelector('.header');
const todoContainer = document.querySelector('.todo');
const todoList = document.querySelector('.list');
const addTodo = document.querySelector('.add-todo');
let isSelectDay = false;

const render = () => {
  const currentYear = date.getFullYear();
  const cureentMonth = date.getMonth();

  document.querySelector('.year').textContent = currentYear;
  document.querySelector('.month').textContent = month[cureentMonth];

  const prevLast = new Date(currentYear, cureentMonth, 0);
  const thisLast = new Date(currentYear, cureentMonth + 1, 0);

  const prevLastDate = prevLast.getDate();
  const prevLastDay = prevLast.getDay();

  const thisLastDate = thisLast.getDate();
  const thisLastDay = thisLast.getDay();

  const prevDateArr = [];
  const thisDateArr = [...Array(thisLastDate + 1).keys()].slice(1);
  const nextDateArr = [];

  if(prevLastDay !== 6)
    for(let i=0; i<prevLastDay+1; i++)
      prevDateArr.unshift(prevLastDate - i);

  for(let i=1; i<7-thisLastDay; i++)
    nextDateArr.push(i);

  const dateArr = prevDateArr.concat(thisDateArr, nextDateArr);
  // prevDateIndex는 
  const prevDateIndex = dateArr.indexOf(1);
  const nextDateIndex = dateArr.lastIndexOf(thisLastDate);

  dateArr.forEach((date, i) => {
    const dateType = i >= prevDateIndex && i < nextDateIndex + 1
                  ? 'this'
                  : 'other';

    const div = document.createElement('div');
    const span = document.createElement('span');
    
    div.classList.add('cell')
    span.classList.add(dateType);
    span.textContent = date;
    
    div.append(span);
    dates.append(div);
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
})