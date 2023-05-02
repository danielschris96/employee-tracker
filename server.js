// import mdules
const mysql = require('mysql2');
const cTable = require('console.table');
const util = require('util');
const inquirer = require('inquirer');

// connect database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'business_db'
  },
);

// promisify db query method
const query = util.promisify(db.query).bind(db);

// function wraps prompts so they can be called on
function prompts() {
  inquirer
  // prompts user to pick an option
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
      // takes user input and calls a function
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
          // exits inquirer 
          else if (action === 'Exit') {
            return;
          }
          else {
              console.log('Invalid selection. Please try again.');
          }
      });
  };


function viewDepartments() {
  // selecting data from table
  query('SELECT * FROM department')
  .then(data => {
    // empty console log to add margin to table in terminal
    console.log();
    // displays table with selected data
    console.table(data);
    // calls prompt function to offer user another option
    prompts();
  })
  .catch(err => {
    console.error(err);
  });
}

function viewRoles() {
  query('SELECT * FROM role')
  .then(data => {
    console.log();
    console.table(data);
    prompts();
  })
  .catch(err => {
    console.error(err);
  });
}

function viewEmployees() {
  query('SELECT * FROM employee')
  .then(data => {
    console.log();
    console.table(data);
    prompts();
  })
  .catch(err => {
    console.error(err);
  });
}

function addDepartment() {
  // prompt to ask what department name is
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
    // inserts new name into department table
    const sql = 'INSERT INTO department (name) VALUES (?)';
    query(sql, [name])
      .then (() => {
        // notifies user of success
        console.log (`Successfully added ${name} to department list`);
        prompts();
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

function addRole() {
// selects id and name for later use
  query('SELECT id, name FROM department')
    .then((results) => {
      // mapping department names into array for later prompt
      const depNames = results.map(result => result.name);
      // prompts to assign new values in table
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
          // choices are current list of department names
          choices: depNames,
        }
      ])
      .then((answers) => {
        // destructuring answers array
        const { title, salary, department } = answers;
        // find matching department name and select the id
        const departmentId = results.find(result => result.name === department).id;
        // inserting new data into table
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
  // empty arrays to be filled for prompt choices
  let roleNames = [];
  let managerNames = [];
  
  query('SELECT title FROM role')
    .then((results) => {
      // setting roleNames array equal to each title from role table
      roleNames = results.map(result => result.title);
    })
    .then(() => {
      query('SELECT first_name, last_name FROM employee')
        .then((results) => {
          // setting manager names equal to concatnated first and last names from selected data
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
              // offering a 'null' option as well as all other employees for manager
              choices: managerNames.concat('null'),
            }
          ])
          .then((answers) => {
            const { firstName, lastName, role, manager } = answers;
            const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            // selecting id where title equals the selected role
            query('SELECT id FROM role WHERE title = ?', [role])
              .then((results) => {
                // results contain single item so selecting index 0
                const roleId = results[0].id;
                // matching id to name of manager
                query('SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?', [manager])
                  .then((results) => {
                    let managerId;
                    // if user selects 'null', assign null value
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
  let employeeNames = [];
  let currentRoles = [];
  query('SELECT title FROM role')
    .then((results) => {
      // mapping array of current roles
      currentRoles = results.map(result => result.title);
    })
    .then(() => {
      query('SELECT first_name, last_name FROM employee')
        .then((results) => {
          // mapping array of current employees
          employeeNames = results.map(result => result.first_name + ' ' + result.last_name);
        })
        .then(() => {
          inquirer.prompt([
            {
              type: 'list',
              name: 'employee',
              message: 'Which employee would you like to update?',
              choices: employeeNames,
            },
            {
              type: 'list',
              name: 'role',
              message: 'What is their new role?',
              choices: currentRoles,
            }
          ])
            .then((answers) => {
              const { employee, role } = answers;
              // updating role for where their full name matches in the table
              const sql = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = '${role}') WHERE CONCAT(first_name, ' ', last_name) = '${employee}'`;
              query(sql)
                .then(() => {
                  console.log('Successfully updated employee role');
                  prompts();
                })
                .catch((err) => {
                  console.log(err);
                });
            });
        });
    });
};

// calling prompt on initial load
prompts();

  