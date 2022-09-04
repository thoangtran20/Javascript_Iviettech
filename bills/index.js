'use strict'

const $ = (id) => {
  return document.getElementById(id);
}

const $tr = ($items) => {
  let tr = document.createElement('tr');
  $items.forEach($item => {
    tr.appendChild($item);
  })
  return tr;
}

const $td = (text) => {
  let td = document.createElement('td')
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

const managerBill = {
  set: function() {
    localStorage.setItem('bills', JSON.stringify(this.bills));
  },
  get: function() {
    this.bills = JSON.parse(localStorage.getItem('bills') || '[]');
    this.bills.forEach(item => {
      item.amount = function() {
        return this.price * this.quantity;
      }
    })
    this.show();
  },
  bills: [], 
  add: function(order_id, product_name, price, quantity) {
    const item = {order_id, product_name, price, quantity, amount: function() {
      return this.price * this.quantity;
    }}
    this.bills.push(item);
    this.set();
  },
  update: function(old_order_id, order_id, product_name, price, quantity) {
    const item = this.bills.find(t => t.order_id == old_order_id);
    if(item == null) {
      alert('Item is not exist');
      return;
    }
    item.order_id = order_id;
    item.product_name = product_name;
    item.price = price;
    item.quantity = quantity;
    $('submit').classList.remove('d-none');
    $('update').classList.add('d-none');
    this.set();
  },
  total: function() {
    let sum = 0;
    for(let i = 0; i < this.bills.length; i++) {
      sum += this.bills[i].amount();
    }
    return sum;
  },
  setForm: function(id) {
    const item = this.bills.find(item => item.order_id == id);
    if(item == null) return;
    $('order_id').value = item.order_id;
    $('product_name').value = item.product_name;
    $('price').value = item.price;
    $('quantity').value = item.quantity;
  
    $('update').value = item.order_id;
    $('update').classList.remove('d-none');
    $('submit').classList.add('d-none');
  },
  delete: function(order_id) {
    this.bills = this.bills.filter(order => order.order_id != order_id);
    this.set();
    this.show();
  },
  show: function() {
    $('bills').innerHTML = '';
    this.bills.forEach(order => {
      const $order_id = $td(order.order_id);
      const $name = $td(order.product_name);
      const $price = $td(order.price);
      const $quantity = $td(order.quantity);
      const $amount = $td(order.amount());

      const $action = document.createElement('td');
      const $edit = $btn('Edit', 'btn btn-info', this.setForm.bind(this, order.order_id));
      $action.appendChild($edit);
      const $delete = $btn('Delete', 'btn btn-danger ms-2', this.delete.bind(this, order.order_id));
      $action.appendChild($delete);
      
      const $row = $tr([$order_id, $name, $price, $quantity, $amount, $action]);
      $('bills').appendChild($row);
    })
    $('total').innerHTML = this.total();
  },
  checkExistId: function(order_id) {
    return this.bills.some(item => item.order_id == order_id);
  }
}

$('submit').onclick = function() {
  const order_id = $('order_id').value;
  const product_name = $('product_name').value;
  const price = $('price').value;
  const quantity = $('quantity').value;
  if(managerBill.checkExistId(order_id) || order_id == '') {
    alert('Order ID not null or has exist.');
    return;
  }
  if(product_name == '') {
    alert('Product name is required');
    return;
  }
  if(isNaN(price) || price <= 0) {
    alert('Price is error');
    return;
  }
  if(isNaN(quantity) || parseInt(quantity) != quantity) {
    alert('Quantity invalid');
    return;
  }
  managerBill.add(order_id, product_name, price, quantity);
  managerBill.show();
  $('order_id').value = '';
  $('product_name').value = '';
  $('price').value = '';
  $('quantity').value = '';
}

$('update').onclick = function() {
  const order_id = $('order_id').value;
  const product_name = $('product_name').value;
  const price = $('price').value;
  const quantity = $('quantity').value;
  const old_order_id = $('update').value;
  if(order_id == '') {
    alert('Order ID is required.');
    return;
  }
  if(product_name == '') {
    alert('Product name is required');
    return;
  }
  if(isNaN(price) || price <= 0) {
    alert('Price is error');
    return;
  }
  if(isNaN(quantity) || parseInt(quantity) != quantity) {
    alert('Quantity invalid');
    return;
  }
  managerBill.update(old_order_id, order_id, product_name, price, quantity);
  managerBill.show();
  $('order_id').value = '';
  $('product_name').value = '';
  $('price').value = '';
  $('quantity').value = '';
}

managerBill.get();
