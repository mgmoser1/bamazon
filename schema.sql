DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;


-- PRODUCTS TABLE --
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price FLOAT(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;

ALTER TABLE products
ADD product_sales FLOAT(10,2) NULL


-- DEPARTMENTS TABLE --
CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  over_head_costs FLOAT(10,2) NULL,
  PRIMARY KEY (department_id)
);

SELECT * FROM departments;
