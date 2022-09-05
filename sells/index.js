'use strict'

const $ = (id) => {
  return document.getElementById(id);
}

const $tr = ($items) => {
  const tr = document.createElement('tr');
  $items.forEach($item => {
    tr.appendChild($item);
  })
  return tr;
}

const $td = (text) => {
  const td = document.createElement('td');
  const $text = document.createTextNode(text);
  td.appendChild($text);
  return td;
}

const $btn = (text, classes, handleEvent) => {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.className = classes;
  const $text = document.createTextNode(text);
  btn.appendChild($text);
  btn.addEventListener('click', handleEvent);
  return btn;
}

const managerEmployee = {
  set: function() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  },
  get: function() {
    this.employees = JSON.parse(localStorage.getItem('employees') || '[]');
    this.employees.forEach(e => {
      e.salary = function() {
        return this.sell / 10;
      }
      e.tax = function() {
        if(this.salary() <= 1000) return 0;
        return (this.salary() - 1000) / 10;
      }
      e.amount = function() {
        return this.salary() - this.tax();
      }
    })
    this.show();
  },
  employees: [],
  add: function(name, sell) {
    const employee = {
      name, sell, 
      salary: function() {
        return this.sell / 10;
      },
      tax: function() {
        if(this.salary() <= 1000) return 0;
        return (this.salary() - 1000) / 10;
      },
      amount: function() {
        return this.salary() - this.tax();
      }
    }
    this.employees.push(employee);
    this.set();
  },
  show: function() {
    $('app').innerHTML = '';
    this.employees.forEach(e => {
      const $name = $td(e.name);
      const $sell = $td(e.sell);
      const $salary = $td(e.salary());
      const $tax = $td(e.tax());
      const $amount = $td(e.amount());
      
      const $row = $tr([$name, $sell, $salary, $tax, $amount]);
      $('app').appendChild($row);
    })
  }
}

$('add').onclick = function() {
  const name = $('name').value;
  const sell = $('sell').value;
  if(name == '') {
    alert('Name is required');
    return;
  }
  if(isNaN(sell) || sell <= 0) {
    alert('Sell invalid');
    return;
  }
  managerEmployee.add(name, sell);
  managerEmployee.show();
  $('name').value = '';
}

managerEmployee.get();
