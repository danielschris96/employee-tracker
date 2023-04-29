const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'courses_db'
  },
  console.log(`Connected to the courses_db database.`)
);

function viewDepartments() {

}

function viewRoles() {

}

function viewEmployees() {

}

function addDepartment() {

}

function addRole() {

}

function addEmployee() {

}

function updateRole() {

}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  module.exports = { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateRole };