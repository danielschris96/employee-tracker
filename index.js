const inquirer = require('inquirer');
const { addDepartment } = require('./server.js');

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
            console.log('View all departments');
        }
        else if (action === 'View all roles') {
            console.log('View all roles');
        }
        else if (action === 'View all employees') {
            console.log('View all employees');
        }
        else if (action === 'Add a department') {
            console.log('Add a department');
        }
        else if (action === 'Add a role') {
            console.log('Add a role');
        }
        else if (action === 'Add an employee') {
            console.log('Add an employee');
        }
        else if (action === 'Update employee role') {
            console.log('Update employee role');
        };
    });