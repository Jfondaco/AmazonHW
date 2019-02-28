var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Ihatepasswords13!",
    database: "bamazon"
});

function firstAsk(){
    console.log("firstAsk is running\n")
    inquirer.prompt([{
        name: "option",
        type: "input",
        message: "What is the ID of the item you want?",
            }]).then(function(response) {
                let chosenID = response.option;
                // use id to check mysql for the ids quantity
                checkQuant(chosenID);
            });
}

function secondAsk(chosenItem){
    console.log("secondAsk is running\n");
    inquirer.prompt([{
        name: "howMany",
        type: "input",
        message: "How many " + chosenItem.product_name +" do you want?",
            }]).then(function(response) {
                //read and update table
                var amount = response.howMany;
                updateTable(amount, chosenItem);
                
            });
}

function checkQuant(chosenID) {
    console.log("checkQuant is running\n");
    // Get the item names.
    var readMyTable = "SELECT * FROM products;";
    connection.query(readMyTable, function(error, results, fields) 
    {
        if (error) {
            throw error
        }
        console.log("Chosen ID: " + chosenID);

        var items = [];
            let chosenItem;
            for (var i = 0; i < results.length; i++) {
                // console.log(results[i].product_name)
                items.push(results[i]);
                    if (chosenID == results[i].id){
                        chosenItem = results[i];
                        console.log("Chosen Item: " + chosenItem)
                        }
            }           
            secondAsk(chosenItem) 

    });
}

function updateTable(amount, chosenItem){
    var readMyTable = "SELECT * FROM products;";
        connection.query(readMyTable, function(error, results, fields) 
            {
                if (error) {
                        throw error
                }     
                console.log(amount);
                console.log(chosenItem);

                if (amount < chosenItem.stock_quantity){
                    console.log("if statement working");
                    var updateMyRow = "UPDATE products SET stock_quantity = ? WHERE id = ?";
                    //NEED TO ADD DATA HERE
                    var data = [chosenItem.stock_quantity - amount, chosenItem.id];
                    connection.query(updateMyRow, data, function(error, results, fields) {
                        if (error) {
                            throw error;
                        }
                        console.log("Quantity has been updated");
                        
                    });
                    console.log("Your order has been placed");
                }
                else {
                    return console.log("Insufficient Quantity")
                }
                });
}

firstAsk();