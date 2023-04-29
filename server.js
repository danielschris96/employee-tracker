const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const util = require('util');

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

// const query = util.promisify(db.query).bind(db);

// function viewDepartments() {
// console.log('hello')
// }

// function viewRoles() {
//   console.log('hello')
// }

// function viewEmployees() {
//   query('SELECT * FROM employees')
//   .then(rows => {
//     console.table(rows);
//   })
//   .catch(err => {
//     console.error(err);
//   });
// }

// function addDepartment() {
//   console.log('hello')
// }

// function addRole() {
//   console.log('hello')
// }

// function addEmployee() {
//   console.log('hello')
// }

// function updateRole() {
//   console.log('hello')
// }


// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
  
//   module.exports = { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateRole };