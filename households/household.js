'use strict'

const $ = (id) => {
  return document.getElementById(id)
}

const $tr = ($list) => {
  const tr = document.createElement('tr')
  $list.forEach(($item) => {
    tr.appendChild($item)
  })
  return tr
}

const $td = (text) => {
  const td = document.createElement('td')
  const $text = document.createTextNode(text)
  td.appendChild($text)
  return td
}

const $thead = (...texts) => {
  const thead = document.createElement('thead')
  let $texts = []
  texts.forEach(($text) => {
    const td = $td($text)
    $texts.push(td)
  })
  const tr = $tr($texts)
  thead.appendChild(tr)
  return thead
}

const $table = (thead, tbody) => {
  const table = document.createElement('table')
  table.className = 'table'
  table.appendChild(thead)
  table.appendChild(tbody)
  return table
}

const $btn = (text, classes, handleEvent) => {
  const btn = document.createElement('button')
  btn.setAttribute('type', 'button')
  const $text = document.createTextNode(text)

  btn.className = classes
  btn.appendChild($text)
  btn.addEventListener('click', handleEvent)

  return btn
}

const HouseHold = function (id = 0, address = '') {
  this.id = id
  this.address = address
}

HouseHold.prototype.initRowHH = function (index, count, detail, $action) {
  const $index = $td(index + 1)
  const $count = $td(count)
  const $address = $td(this.address)
  const $detail = document.createElement('td')
  $detail.appendChild(detail)
  return $tr([$index, $address, $count, $detail, $action])
}

const People = function (
  id = 0,
  fullName = '',
  gender = '',
  relationship = '',
  birthday = '',
  job = '',
  household_id = '',
) {
  this.id = id
  this.fullName = fullName
  this.gender = gender
  this.relationship = relationship
  this.birthday = birthday
  this.job = job
  this.household_id = household_id
}

People.prototype.initRowPeople = function (index, $action) {
  const $index = $td(index + 1)
  const $fullName = $td(this.fullName)
  const $gender = $td(this.gender)
  const $relationship = $td(this.relationship)
  const $birthday = $td(this.birthday)
  const $job = $td(this.job)
  const $row = $tr([
    $index,
    $fullName,
    $gender,
    $relationship,
    $birthday,
    $job,
    $action,
  ])
  return $row
}

const managerPeople = {
  get: null,
  set: null,
  peoples: [],
  auto_increase_id: 1,
  update: null,
  add: null,
  show: null,
  delete: null,
  findByHH: null,
  deleteByHH: null,
  setForm: null,
  initTable: null,
  count: null,
  validate: null,
}

const managerHouseHold = {
  get: null,
  set: null,
  houseHolds: [],
  auto_increase_id: 1,
  update: null,
  add: null,
  show: null,
  delete: null,
  setForm: null,
  validate: null,
  setSelect: null,
}

managerPeople.get = function () {
  this.peoples = JSON.parse(localStorage.getItem('peoples') || '[]').map(
    (p) =>
      new People(
        p.id,
        p.fullName,
        p.gender,
        p.relationship,
        p.birthday,
        p.job,
        p.household_id,
      ),
  )
  this.auto_increase_id = Math.max(...this.peoples.map((p) => p.id), 0) + 1
}

managerPeople.set = function() {
  localStorage.setItem('peoples', JSON.stringify(this.peoples));
}

managerPeople.add = function(fullName, gender, relationship, birthday, job, household_id) {
  const pp = new People(this.auto_increase_id++, fullName, gender, relationship, birthday, job, household_id);
  this.peoples.push(pp);
  this.set();
  this.setForm(new People());
  managerHouseHold.show();
}

managerPeople.update = function(id, fullName, gender, relationship, birthday, job, household_id) {
  const pp = this.peoples.find(p => p.id == id);
  if(pp == null) {
    alert('People is not exist');
    return;
  }
  pp.fullName = fullName;
  p.gender = gender;
  p.relationship = relationship;
  p.birthday = birthday;
  p.job = job;
  p.household_id = household_id;
  this.set();
  this.setForm(new People());
  managerHouseHold.show();
}

managerPeople.findByHH = function(household_id) {
  return this.peoples.filter(p => p.household_id == household_id) || [];
}

managerPeople.delete = function(id) {
  const index = this.peoples.findIndex(p => p.id == id);
  if(index == -1) return;
  this.peoples.splice(index, 1);
  this.set();
  managerHouseHold.show();
}

managerPeople.deleteByHH = function(household_id) {
  this.peoples = this.peoples.filter(p => p.household_id != household_id);
  this.set();
  managerHouseHold.show();
}

managerPeople.show = function(household_id) {
  const pps = this.findByHH(household_id);
  if(pps.length == 0) return document.createElement('table');

  let $rows = [];
  pps.forEach((pp, i) => {
    const $action = document.createElement('td');
    const $edit = $btn('Edit', 'btn btn-warning', this.setForm.bind(this, pp));
    const $delete = $btn('Delete', 'btn btn-danger ms-2', this.delete.bind(this, pp.id));
    $action.appendChild($edit);
    $action.appendChild($delete);
    $rows.push(pp.initRowPeople(i, $action));
  })
  return this.initTable($rows);
}

managerPeople.initTable = function($rows) {
  const thead = $thead('No', 'Full Name', 'Gender', 'Relationship', 'Birthday', 'Job', 'Action');
  const tbody = document.createElement('tbody');
  $rows.forEach($row => {
    tbody.appendChild($row);
  })
  return $table(thead, tbody);
}

managerPeople.setForm = function(p) {
  $('fullName').value = p.fullName;
  $('gender').checked = p.gender == 'Male' ? true : false;
  $('relationship').value = p.relationship;
  $('birthday').value = p.birthday;
  $('job').value = p.job;
  $('houseHold').value = p.household_id;
  if(p.id != 0) {
    $('update_people').value = p.id;
    $('update_people').classList.remove('d-none');
    $('add_people').classList.add('d-none');
  } else {
    $('update_people').classList.add('d-none');
    $('add_people').classList.remove('d-none');
  }
}

managerPeople.count = function(household_id) {
  return this.peoples.filter(p => p.household_id == household_id).length;
}

managerPeople.validate = function(fullName, birthday, relationship, job, household_id) {
  if(fullName == '') {
    alert('Full name is required');
    return false;
  }
  if(birthday == '') {
    alert('Birthday is required');
    return false;
  }
  if(relationship == '') {
    alert('Relationship is required');
    return false;
  }
  if(job == '') {
    alert('Job is required');
    return false;
  }
  if(household_id == '') {
    alert('House Hold is required');
    return false;
  }
  return true;
}

managerHouseHold.get = function() {
  const hhs = JSON.parse(localStorage.getItem('houseHolds') || '[]');
  this.houseHolds = hhs.map(h => new HouseHold(h.id, h.address));
  this.auto_increase_id = Math.max(...this.houseHolds.map(p => p.id), 0) + 1;
  this.show();
}

managerHouseHold.set = function() {
  localStorage.setItem('houseHolds', JSON.stringify(this.houseHolds));
}

managerHouseHold.add = function(address) {
  this.houseHolds.push(new HouseHold(this.auto_increase_id++, address));
  this.set();
  this.setForm(new HouseHold());
  this.show();
}

managerHouseHold.setSelect = function() {
  let html = '';
  this.houseHolds.forEach(h => {
    html += `<option value="${h.id}">${h.address}</option>`
  })
  $('houseHold').innerHTML = html;
}

managerHouseHold.show = function() {
  $('app').innerHTML = '';
  this.setSelect();
  this.houseHolds.forEach((h, i) => {
    const $action = document.createElement('td');
    const $edit = $btn('Edit', 'btn btn-warning', this.setForm.bind(this, h));
    const $delete = $btn('Delete', 'btn btn-danger ms-2', this.delete.bind(this, h.id));

    $action.appendChild($edit);
    $action.appendChild($delete);

    const $detail = managerPeople.show(h.id);
    $('app').appendChild(h.initRowHH(i, managerPeople.count(h.id), $detail, $action));
  })
}

managerHouseHold.update = function(id, address) {
  const h = this.houseHolds.find(h => h.id == id);
  if(h == null) {
    alert('Household is not exist');
    return;
  }
  h.address = address;
  this.set();
  this.setForm(new HouseHold());
  this.show();
}


managerHouseHold.delete = function(id) {
  const index = this.houseHolds.findIndex(h => h.id == id);
  if(index >= 0) {
    this.houseHolds.splice(index, 1);
    managerPeople.deleteByHH(id);
    this.set();
    this.show();
  }
}

managerHouseHold.setForm = function(h) {
  $('address').value = h.address;
  if(h.id != 0) {
    $('update_household').value = h.id;
    $('update_household').classList.remove('d-none');
    $('add_household').classList.add('d-none');
  } else {
    $('update_household').classList.add('d-none');
    $('add_household').classList.remove('d-none');
  }
}

managerHouseHold.validate = function(address) {
  if(address == '') {
    alert('Address is required');
    return false;
  }
  return true;
}

managerPeople.get();
managerHouseHold.get();

$('add_household').onclick = function() {
  const address = $('address').value;
  if(managerHouseHold.validate(address)) {
    managerHouseHold.add(address);
  }
}

$('update_household').onclick = function() {
  const address = $('address').value;
  const id = this.value;
  if(managerHouseHold.validate(address)) {
    managerHouseHold.update(id, address);
  }
}

$('add_people').onclick = function() {
  const fullName = $('fullName').value;
  const gender = $('gender').checked ? 'Male' : 'Female';
  const relationship = $('relationship').value;
  const birthday = $('birthday').value;
  const job = $('job').value;
  const household_id = $('houseHold').value;
  if(managerPeople.validate(fullName, relationship, birthday, job, household_id)) {
    managerPeople.add(fullName, gender, relationship, birthday, job, household_id);
  }
}

$('update_people').onclick = function() {
  const id = this.value;
  const fullName = $('fullName').value;
  const gender = $('gender').checked ? 'Male' : 'Female';
  const relationship = $('relationship').value;
  const birthday = $('birthday').value;
  const job = $('job').value;
  const household_id = $('houseHold').value;
  if(managerPeople.validate(fullName, relationship, birthday, job, household_id)) {
    managerPeople.update(id, fullName, gender, relationship, birthday, job, household_id);
  }
}
