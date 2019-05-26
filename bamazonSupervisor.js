/* Node Requirements */
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

// Connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Port; default is 3306
  port: 3306,

  // username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    superChoice();
   
  });


  //// Ends mySQL database connection ////

function disconnect() {
  console.log("Good Bye!");
  connection.end();                          //// END CONNECTION ////
}


    //// Displays choices to View, Add, or Quit ////

  function superChoice() {
   
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Product Sales by Department":
        deptSalesView();
        break;

        case "Create New Department":
      //  lowInv();
        deptCreate();
        break;

        case "Quit":
        disconnect();
        break;
      }
    });
}


function deptSalesView() {

    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales) - departments.over_head_costs) AS total_profits FROM products INNER JOIN departments ON departments.department_name = products.department_name GROUP BY department_name";
 
    connection.query(query, function(err, res) {
      if (err) throw err;
      var resultsArray = [];
      
      for (var i = 0; i < res.length; i++) {
    //    console.log("Department ID: " + res[i].department_id + " || Department Name: " + res[i].department_name + " || Overhead Costs: $" + Number.parseFloat(res[i].over_head_costs).toFixed(2) + " || Product Sales: $" + Number.parseFloat(res[i].product_sales).toFixed(2) + " || Total Profit: $" + Number.parseFloat(res[i].total_profits).toFixed(2));
   
        var obj = {};
          obj.department_ID = res[i].department_id;
          obj.department_Name = res[i].department_name;
          obj.overhead_Costs = Number.parseFloat(res[i].over_head_costs).toFixed(2);
          obj.product_Sales = Number.parseFloat(res[i].product_sales).toFixed(2);
          obj.total_Profit = Number.parseFloat(res[i].total_profits).toFixed(2);

          resultsArray.push(obj);

        };
        console.log("\n");
        console.table(resultsArray);

        superChoice();
  })  

}

function  deptCreate() {
   
    inquirer
    .prompt([{
        name: "deptName",
        type: "input",
        message: "Please enter the name of new department: "
      },
      {
        name: "overheadString",
        type: "input",
        message: "Overhead Costs: ",
        validate: function(value) {
          if (isNaN(value) === false && value > 0) {
            return true;
          }
            return false;
          }
          
        }])
    .then(function(answer) {
        var {deptName, overheadString} = answer;
        var overhead = parseFloat(overheadString);
     
      var query = "INSERT INTO departments SET ?";
      var values =  { department_name: deptName, over_head_costs: overhead };
            
       connection.query(query, values, function(err, res) {
          if (err) throw err;
          console.log(deptName + " department added. The Department ID is " + res.insertId + ".");
          superChoice();
          })
      })
}



  

