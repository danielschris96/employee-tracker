const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const util = require('util');
const inquirer = require('inquirer');

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

const query = util.promisify(db.query).bind(db);

function viewDepartments() {
  query('SELECT * FROM department')
  .then(rows => {
    console.table(rows);
  })
  .catch(err => {
    console.error(err);
  });
}

function viewRoles() {
  query('SELECT * FROM role')
  .then(rows => {
    console.table(rows);
  })
  .catch(err => {
    console.error(err);
  });
}

function viewEmployees() {
  query('SELECT * FROM employee')
  .then(rows => {
    console.table(rows);
  })
  .catch(err => {
    console.error(err);
  });
}

function addDepartment() {
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the department that you would like to add?',
    },
  ])
  .then((answers) => {
    const { name } = answers;
    const sql = 'INSERT INTO departments (name) VALUES (?)';
    query(sql, [name])
      .then (() => {
        console.log (`Successfully added ${name} to department list`);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

function addRole() {
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the name of the role that you would like to add?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary for this role?',
    },
    {
      type: 'list',
      name: 'department',
      message: 'What department does this role belong to?',
      choices: [
        
      ]
    }
  ])
  .then((answers) => {
    const { title } = answers;
    const sql = 'INSERT INTO role (title) VALUES (?)';
    query(sql, [title])
      .then (() => {
        console.log (`Successfully added ${title} to department list`);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function addEmployee() {
  console.log('hello')
}

function updateRole() {
  console.log('hello')
}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  module.exports = { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateRole };