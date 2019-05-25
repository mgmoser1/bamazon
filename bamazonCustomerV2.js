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



  //// Displays  the ids, names, and prices of all of the items available for sale. ////
  
  function displayInv() {

    connection.connect(function(err) {
        if (err) throw err;
      });

    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function(err, res) {
      if (err) throw err;
      
      for (var i = 0; i < res.length; i++) {
        console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: $" + Number.parseFloat(res[i].price).toFixed(2));  // price is a string
      }
      disconnect(); 
      prompter();

    });
  }

 //// Displays choice to View Menu or Quit ////

  function sessionChoice() {
   
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "See Carbon Offset Menu",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "See Carbon Offset Menu":
        displayInv();
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
  

  //// Prompts user to select a product by item number and specify the number of units to be purchased. ////

  function prompter () {
      inquirer
      .prompt([{
        name: "itemID",
        type: "input",
        message: "Please enter the Item ID of the carbon offset you would like to purchase: "
      /*   validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          } */
      },
      {
        name: "numBuyingString",
        type: "input",
        message: "Please enter the desired quantity: "
      }])
      .then(function(answer){

        var {itemID, numBuyingString} = answer;
        var numBuying = parseInt(numBuyingString);

      /* Input validation and inventory check */
        if (!(isNaN(numBuying))){

            connection.connect(function(err) {
                if (err) throw err;
            });

          var query = "SELECT item_id, product_name, price, stock_quantity, product_sales FROM products WHERE ?";
          connection.query(query, { item_id: itemID }, function(err, res) {
        
            if (err) throw err;
          
            var {item_id, product_name, price, stock_quantity, product_sales} = res[0];

            /* console.log ("Item ID: " + item_id);
            console.log ("Product Name: " + product_name);
            console.log ("Price: " + Number.parseFloat(price).toFixed(2));
            console.log ("Stock: " + stock_quantity); */

            if (numBuying >= 1 && numBuying <= stock_quantity) {

             /* Reduce stock in mySQL database */
              stock_quantity -= numBuying;
              var total = numBuying * price;
              var totalSales = product_sales + total;

              var query = "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?";
              connection.query(query, [ stock_quantity, totalSales, item_id ], function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " record(s) updated");                
                disconnect();
             /* Alert user sale complete */   
                if (numBuying == 1) {
                  console.log("You have purchased " + numBuying + " " + product_name + " offset for a total amount of $" + Number.parseFloat(total).toFixed(2) + ". Thank you!");

                  sessionChoice();
              }else {
                  console.log("You have purchased " + numBuying + " " + product_name + " offsets for a total amount of $" + Number.parseFloat(total).toFixed(2) + ". Thank you!");
    
                  sessionChoice();
              }
              
              });

              
            }else if  (numBuying > stock_quantity){
              console.log("Insufficient quantity in stock. Please try again.")
              sessionChoice();
            }else if (numBuying < 1) {
              console.log("That is not a valid amount. Please try again.");
              sessionChoice();
            }

            });
        }else{
          console.log("That is not a valid amount. Please try again.");
          sessionChoice();
        }
        
      })
      
  }

  sessionChoice();
 

 