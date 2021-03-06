# bamazon

**A command line storefront using Node.js and MySQL**

This version of bamazon, created for a school project, is a carbon offset marketplace populated with real world items available through [Gold Standard](www.goldstandard.org).


## Getting Started
To run this app, clone it to a local repository and run `npm install` from the terminal. You will also need to run `npm install mysql`, `npm install inquirer`, and `npm install console.table`. Once these have been installed, you can run the customer, manager, and supervisor interfaces by typing "node" plus the applicable file name in the command line.


## Project Overview
**The Customer Interface** shows a list of sustainable development projects in which non-paying shares can be purchased to offset their personal climate impact. One share equals one ton of carbon offset. (The average American produces two tons of carbon per month through normal activity.) The customer enters the item ID of the project and the number of shares that they wish to purchase.

**The Manager Interface** allows managers to view and add inventory as well as add new products to the database.

**The Supervisor Interface** allows supervisors to view sales by department and add new departments.

## Demo Videos
**[Customer Interface](https://drive.google.com/open?id=1zP9Gd0VV8TsJkDWAfCtmwmpbLnsB_YCG)**

**[The Manager Interface](https://drive.google.com/open?id=1xC-Q8M1HC45SOy_IkJ5B9H7ej6fzXo9V)**

**[The Supervisor Interface](https://drive.google.com/open?id=1Vwb20Eie6Omfhuw3CKIS4d_JRPC-mVRP)**


## Tools
The app uses JavaScript for the logic and user interface and mySQL for data storage. The Inquirer Node module is used to make the CLI more user friendly for gathering user input and greatly assisted in input validation. The Console.Table Node module is used to increase readability of the returned data.



