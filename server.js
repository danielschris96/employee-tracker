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
    password: '',
    database: 'business_db'
  },
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
    const sql = 'INSERT INTO department (name) VALUES (?)';
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
      choices: results.map(result => result.name),
    }
  ])
  .then((answers) => {
    const { title, salary, department } = answers;
    const sql = 'INSERT INTO role (title, salary, department) VALUES (?, ?, ?)';
    query(sql, [title, salary, department])
      .then (() => {
        console.log (`Successfully updated the role table`);
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