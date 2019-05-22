/* Node Requirements */
var mysql = require("mysql");
var inquirer = require("inquirer");

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


  //// Displays choice to View Menu or Quit ////

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

//// Ends mySQL database connection ////

function disconnect() {
  console.log("Good Bye!");
  connection.end();                          //// END CONNECTION ////
}
  



//// Displays all inventory for sale ////

function MgrDisplayInv() {
    
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function(err, res) {

      if (err) throw err;
      
      for (var i = 0; i < res.length; i++) {
        console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: $" + Number.parseFloat(res[i].price).toFixed(2) + " || Quantity: " + res[i].stock_quantity);
      }
      
      managerChoice();

    });
}

//// list all items with an inventory count lower than five ////   WORKS. Change number to 5 after testing.

function lowInv() {
    
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 500"; // <- ?
    connection.query(query, function(err, res) { // {  }, 
        if (err) throw err;
        
        for (var i = 0; i < res.length; i++) {
          console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: $" + Number.parseFloat(res[i].price).toFixed(2) + " || Quantity: " + res[i].stock_quantity);
        }
        
        managerChoice();
  
      });

    }

function addInv() {
    inquirer
    .prompt([{
        name: "itemID",
        type: "input",
        message: "Please enter the ID of item to add inventory for: "
      /*   validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          } */
      },
      {
        name: "addQuantString",
        type: "input",
        message: "Please enter the quantity to add: "
      }])
    .then(function(answer) {
        var {itemID, addQuantString} = answer;
        var addQuantity = parseInt(addQuantString);

      /* Input validation and inventory check */
       if (!(isNaN(addQuantity))){

      var query1 = "SELECT item_id, product_name, stock_quantity FROM products WHERE item_id = ?"; // <- ?
      connection.query(query1, [ itemID ], function(err, res) { // {  }, 
          if (err) throw err;
          var {item_id, product_name, stock_quantity} = res[0];
          var currentInv = parseInt(stock_quantity);
          var updatedInv = currentInv + addQuantity; 
          
              var query2 = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";  // += does not work. May need to run SELECT above and assign a variable to manually change.
              connection.query(query2, [ updatedInv, itemID ], function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " record(s) updated");
                console.log("Inventory updated from " + currentInv + " to " + updatedInv + " for the item " + product_name + ".");
                managerChoice();
                    
               })
              
              })
      } 

})
}

/* INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
    ("Planting Biodiverse Forests in Panama", "Forest Conservation/Reforestation", 18.00, 601), */

function addItem() {
  inquirer
  .prompt([{
      name: "itemName",
      type: "input",
      message: "Please enter the name of new product: "
    /*   validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        } */
    },
    {
    name: "itemDept",
      type: "input",
      message: "Assigned department: "
    },
    {
      name: "itemPriceString",
        type: "input",
        message: "Price: "
      },
    {
      name: "itemQuantString",
      type: "input",
      message: "Quantity: "
    }])
  .then(function(answer) {
      var {itemName, itemDept, itemPriceString, itemQuantString } = answer;
      var price = parseInt(itemPriceString);
      var quantity = parseInt(itemQuantString);

    /* Input validation and inventory check */
     if (!(isNaN(quantity))){

    var query = "INSERT INTO products SET ?"; // (product_name, department_name, price, stock_quantity)
    var values =  { product_name: itemName , department_name: itemDept, price: price, stock_quantity: quantity };
          
 //   var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE item_id = ?"; // <- ?
    connection.query(query, values, function(err, res) { // {  }, 
        if (err) throw err;
        console.log("Product added. The Item ID is " + res.insertId + ".");
        managerChoice();
        })
    } 

})
}
