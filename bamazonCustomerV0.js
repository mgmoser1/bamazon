var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    displayInv();
    connection.end();
  });

  //// Displays  the ids, names, and prices of all of the items available for sale. ////
  
  function displayInv () {

      connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        var itemArray = [];
/* for (var i=0; i<3; i++) {   // Sample from here: https://www.codecademy.com/en/forum_questions/50c207bd55df51ff27004775
    title[i] = {
        name: "name" + i+1,
        age: "age" + i+1,
        hometown: "hometown" + i+1
    };
} */
        for (var i = 0; i < res.length; i++) {
          console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: $" + Number.parseFloat(res[i].price).toFixed(2));  // price is a string
          itemArray[i] = {
              id : res[i].item_id,
              quantity: res[i].stock_quantity
          };

        }
        
        prompter(itemArray);
  
      });
  }

  //// Prompts user to select a product by item number and specify the number of units to be purchased. ////

  function prompter (arr) {
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
        name: "numBuying",
        type: "input",
        message: "Please enter the quantity you would like to purchase: "
      }])
      .then(function(answer){

        var {itemID, numBuying} = answer;
          console.log ("Item ID: " + itemID);
          console.log ("numBuying: " + numBuying);
        
          // I WAS HERE //

        var index = arr.id.indexOf(itemID);  // undefined. IndexOf may not work on objects?
        console.log(index);
       
            if (!(index === -1)) {
                if (arr[index].quantity >= numbuying) {
                    // reduce inventory in mySQL
                    console.log("You have purchased " + numbuying + " of item #" + itemID + ". Thank you!"); // if this works, add product name to arr and change display.
                }else {
                    console.log ("Item ID is not valid. Please try again.")
                    displayInv();
                }
            }
          

      })
  }