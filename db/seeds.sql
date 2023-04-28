USE business_db;

INSERT INTO department (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Finance');

INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 80000.00, 1),
  ('Sales Representative', 50000.00, 1),
  ('Marketing Manager', 75000.00, 2),
  ('Marketing Coordinator', 45000.00, 2),
  ('Financial Analyst', 65000.00, 3),
  ('Accountant', 55000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Mike', 'Johnson', 3, 1),
  ('Sara', 'Lee', 4, 3),
  ('Tom', 'Kim', 5, 3),
  ('Chris', 'Jones', 6, 3);