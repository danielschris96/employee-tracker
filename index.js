const inquirer = require('inquirer');
const { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateRole } = require('./server.js');

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
                'Update employee role'
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
        else {
            console.log('Invalid selection. Please try again.');
        }
    });
};
