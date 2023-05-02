const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const util = require('util');
const inquirer = require('inquirer');

// const PORT = process.env.PORT || 3001;
// const app = express();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'business_db'
  },
);

const query = util.promisify(db.query).bind(db);

function prompts() {
  inquirer
      .prompt([
          {
              type: 'list',
              name: 'action',
              message: 'What would you like to do?',
              choices: [
                  'View all departments',
                  'View all roles',
                  'View all employees',
                  'Add a department',
                  'Add a role',
                  'Add an employee',
                  'Update employee role',
                  'Exit'
              ],
          },
      ])
      .then((answers) => {
          const { action } = answers;
          if (action === 'View all departments') {
              viewDepartments();
          }
          else if (action === 'View all roles') {
              viewRoles();
          }
          else if (action === 'View all employees') {
              viewEmployees();
          }
          else if (action === 'Add a department') {
              addDepartment();
          }
          else if (action === 'Add a role') {
              addRole();
          }
          else if (action === 'Add an employee') {
              addEmployee();
          }
          else if (action === 'Update employee role') {
              updateRole();
          }
          else if (action === 'Exit') {
            return;
          }
          else {
              console.log('Invalid selection. Please try again.');
          }
      });
  };

function viewDepartments() {
  query('SELECT * FROM department')
  .then(rows => {
    console.log();
    console.table(rows);
    prompts();
  })
  .catch(err => {
    console.error(err);
  });
}

function viewRoles() {
  query('SELECT * FROM role')
  .then(rows => {
    console.log();
    console.table(rows);
    prompts();
  })
  .catch(err => {
    console.error(err);
  });
}

function viewEmployees() {
  query('SELECT * FROM employee')
  .then(rows => {
    console.log();
    console.table(rows);
    prompts();
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
  query('SELECT id, name FROM department')
    .then((results) => {
      const depNames = results.map(result => result.name);

      inquirer.prompt([
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
          choices: depNames,
        }
      ])
      .then((answers) => {
        const { title, salary, department } = answers;

        const departmentId = results.find(result => result.name === department).id;

        const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        query(sql, [title, salary, departmentId])
          .then (() => {
            console.log (`Successfully updated the role table`);
            prompts();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
}

function addEmployee() {
  let roleNames = [];
  let managerNames = [];

  query('SELECT title FROM role')
    .then((results) => {
      roleNames = results.map(result => result.title);
    })
    .then(() => {
      query('SELECT first_name, last_name FROM employee')
        .then((results) => {
          managerNames = results.map(result => result.first_name + ' ' + result.last_name);
        })
        .then(() => {
          inquirer.prompt([
            {
              type: 'input',
              name: 'firstName',
              message: 'What is the first name of the employee?',
            },
            {
              type: 'input',
              name: 'lastName',
              message: 'What is the last name of the employee?',
            },
            {
              type: 'list',
              name: 'role',
              message: 'What role does this employee have?',
              choices: roleNames,
            },
            {
              type: 'list',
              name: 'manager',
              message: 'Who is their manager?',
              choices: managerNames.concat('null'),
            }
          ])
          .then((answers) => {
            const { firstName, lastName, role, manager } = answers;
            const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            query('SELECT id FROM role WHERE title = ?', [role])
              .then((results) => {
                const roleId = results[0].id;
                query('SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?', [manager])
                  .then((results) => {
                    let managerId;
                    if (manager === 'null') {
                      managerId = null;
                    } else {
                      managerId = results[0].id;
                    }
                    query(sql, [firstName, lastName, roleId, managerId])
                      .then(() => {
                        console.log('Successfully added employee to the database');
                        prompts();
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  });
              });
          });
        });
    });
}


function updateRole() {
  console.log('hello')
}


prompts();

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
  