/* Node Requirements */
var mysql = require("mysql");
var inquirer = require("inquirer");
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
    managerChoice();
   
  });

  //// Ends mySQL database connection ////

function disconnect() {
  console.log("Good Bye!");
  connection.end();                          //// END CONNECTION ////
}



  //// Displays choices to View, Add, or Quit ////

  function managerChoice() {
   
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View Products For Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products For Sale":
        MgrDisplayInv();
        break;

        case "View Low Inventory":
        lowInv();
        break;

        case "Add to Inventory":
        addInv();
        break;

        case "Add New Product":
        addItem();
        break;

        case "Quit":
        disconnect();
        break;
      }
    });
}



//// Displays all inventory for sale ////

function MgrDisplayInv() {
    
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function(err, res) {

      if (err) throw err;

      var resultsArray = [];
      
      for (var i = 0; i < res.length; i++) {
    //    console.log("Department ID: " + res[i].department_id + " || Department Name: " + res[i].department_name + " || Overhead Costs: $" + Number.parseFloat(res[i].over_head_costs).toFixed(2) + " || Product Sales: $" + Number.parseFloat(res[i].product_sales).toFixed(2) + " || Total Profit: $" + Number.parseFloat(res[i].total_profits).toFixed(2));
   
        var obj = {};
          obj.item_ID = res[i].item_id;
          obj.product_Name = res[i].product_name;
          obj.price = Number.parseFloat(res[i].price).toFixed(2);
          obj.quantity = Number.parseInt(res[i].stock_quantity);

          resultsArray.push(obj);

        };
        console.log("\n");
        console.table(resultsArray);

        managerChoice();
  })  
}

//// Lists all items with an inventory count lower than 200 ////

function lowInv() {
    
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 200"; // <- ?
    connection.query(query, function(err, res) {
        if (err) throw err;

        var resultsArray = [];
      
      for (var i = 0; i < res.length; i++) {
    //    console.log("Department ID: " + res[i].department_id + " || Department Name: " + res[i].department_name + " || Overhead Costs: $" + Number.parseFloat(res[i].over_head_costs).toFixed(2) + " || Product Sales: $" + Number.parseFloat(res[i].product_sales).toFixed(2) + " || Total Profit: $" + Number.parseFloat(res[i].total_profits).toFixed(2));
   
        var obj = {};
          obj.item_ID = res[i].item_id;
          obj.product_Name = res[i].product_name;
          obj.price = Number.parseFloat(res[i].price).toFixed(2);
          obj.quantity = Number.parseInt(res[i].stock_quantity);

          resultsArray.push(obj);

        };
        console.log("\n");
        console.table(resultsArray);
        
        managerChoice();
  
      });

    }


//// Adds new stock to the stock_quantity field of an existing item in the products table. ////   

function addInv() {

  function itemListGenerator() {
    return new Promise((resolve, reject) => {
    var query = "SELECT item_id FROM products";
    connection.query(query, function(err, res) {
  
      if (err) return reject (err)
  
      var itemList = [];
  
      for (var i = 0; i < res.length; i++) {
        itemList.push(res[i].item_id);
      }
      resolve (itemList)
    });
  })
  }

  itemListGenerator()
  .then(iList => {

    inquirer
    .prompt([{
        name: "itemID",
        type: "input",
        message: "Please enter the ID of item to add inventory for: ",
         validate: function(value) {
            if (isNaN(value) === false && iList.includes(parseFloat(value)) == true) {
              return true;
            }
            return false;
          }
      },
      {
        name: "addQuantString",
        type: "input",
        message: "Please enter the quantity to add: ",
        validate: function(value) {
        if (isNaN(value) === false && value > 0) {
          return true;
        }
        return false;
      }
      
      }])
    .then(function(answer) {
        var {itemID, addQuantString} = answer;
        var addQuantity = parseInt(addQuantString);

      /* Inventory check */
      
      var query1 = "SELECT item_id, product_name, stock_quantity FROM products WHERE item_id = ?";
      connection.query(query1, [ itemID ], function(err, res) {
          if (err) throw err;
          var {item_id, product_name, stock_quantity} = res[0];
          var currentInv = parseInt(stock_quantity);
          var updatedInv = currentInv + addQuantity;
          
              var query2 = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
              connection.query(query2, [ updatedInv, itemID ], function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " record(s) updated");
                console.log("Inventory updated from " + currentInv + " to " + updatedInv + " for the item " + product_name + ".");
                managerChoice();
                    
               })
              
              })

    })

})
.catch(err => {
  throw err;
})
}

//// Adds a new item to the products table. ////

function addItem() {

  function deptListGenerator() {
    return new Promise((resolve, reject) => {
    var query = "SELECT department_name FROM departments";
    connection.query(query, function(err, res) {
  
      if (err) return reject (err)
  
      var deptList = [];
  
      for (var i = 0; i < res.length; i++) {
        deptList.push(res[i].department_name);
        
     //   console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: $" + Number.parseFloat(res[i].price).toFixed(2) + " || Quantity: " + res[i].stock_quantity);
      }
      resolve (deptList)
    });
  })
  }

  deptListGenerator()

  .then(value => {

  inquirer
  .prompt([{
      name: "itemName",
      type: "input",
      message: "Please enter the name of new product: "
    },
    {
    
      name: "itemDept",
      type: "rawlist",
      message: "Assigned department: ",
      choices: value
    
    },
    {
      name: "itemPriceString",
      type: "input",
      message: "Price: ",
      validate: function(value) {
        if (isNaN(value) === false && value > 0) {
          return true;
        }
          return false;
        }
        
      },
    {
      name: "itemQuantString",
      type: "input",
      message: "Quantity: ",
      validate: function(value) {
        if (isNaN(value) === false && value > 0) {
          return true;
        }
        return false;
      }
    }])
  .then(function(answer) {
      var { itemName, itemDept, itemPriceString, itemQuantString } = answer;
      var price = parseInt(itemPriceString);
      var quantity = parseInt(itemQuantString);

    /* Input validation and inventory check */

    var query = "INSERT INTO products SET ?";
    var values =  { product_name: itemName , department_name: itemDept, price: price, stock_quantity: quantity, product_sales: 0 };
          
    connection.query(query, values, function(err, res) {
        if (err) throw err;
        console.log("Product added. The Item ID is " + res.insertId + ".");
        managerChoice();
        })
    
})
})
.catch(err => {
  throw err;
})
}
