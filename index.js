let date = new Date();
const month = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

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
  const prevDateIndex = dateArr.indexOf(1);
  const nextDateIndex = dateArr.indexOf(thisLastDate);

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
    document.querySelector('.dates').append(div);
  })
}

render();
