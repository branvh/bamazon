const mysql = require('mysql');
const inquirer = require('inquirer');

//================================CONNECT TO DB===================================================================
const DB = 'bamazon';
const PRODUCT_TABLE = 'products';
const PASS = 'MGoblue3!';

let con = mysql.createConnection({

    host: 'localhost',
    port: 3306,
    user: 'root',
    password: PASS,
    database: DB

});

//================================FUNCTIONS========================================================================

//use promises to ensure correct order of initialization procedures

let run = () => {

    return new Promise((resolve, reject) => {

        con.connect((err) => {

            if (err) {
                reject(err);
            } else {
                resolve();
            }

        });

    });

}

//function to display current bamazon inventory upon loading page

const displayInventory = () => {
    con.query('select * from products', (err, data) => {

        console.log('===========================CURRENT BAMAZON INVENTORY==========================');
        console.log('\n');
        data.forEach((item, index) => {

            let displayText = 'Product Name: ' + item['product_name'] + '\t\t Price: ' + item['price'] + '\t\t Item ID: ' + item['item_id'] + ' ';
            console.log(displayText);

        });
        console.log('\n');
        console.log('===========================END OF LIST========================================');
        console.log('\n');

        //take customer order after inventory displayed
        orderIntake();

    });

}

const placeOrder = (id, amount) => {

    con.query('select (stock_quantity) from products where item_id=?', [id], (err, data) => {

        let quantity = parseInt(data[0].stock_quantity);

        //if bamazon has enough inventory, calculate the new units remaining after this order and update DB
        if (quantity >= amount) {
            let newAmnt = quantity - amount;

            //update inventory records with new amount
            updateInventory(id, newAmnt);

            //tell customer how much their order will cost
            orderPrice(id, amount);

        } else { //otherwise, tell the customer to order fewer units
            console.log(`We don\'t have that many units, please order ${quantity} or less units`);
        }

    });

}

const updateInventory = (id, amnt) => {

    con.query('update products set stock_quantity=? where item_id=?', [amnt, id], (err, res) => {

        if (err) throw err;

    })

}

const orderPrice = (id, amnt) => {

    con.query('select price from products where item_id=?', id, (err, res) => {

    	//calculate order prie and then inform the customer
        let price = parseInt(res[0].price) * amnt;
        console.log(`Your order will cost $${price}\n`);

    });

}

//=============================ORDER FULFILLMENT CAPTURE PROCESS=======================================================

let orderIntake = () => {
    inquirer.prompt([{
        name: "item_id",
        type: "input",
        message: "Input the ITEM ID of the product you would like to buy."
    }, {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }]).then((res) => {

        //capture item id, quantity ordered, and run order fulfillment function
        let id = res['item_id'];
        let q = parseInt(res['quantity']);

        placeOrder(id, q);

    }).catch((err) => {
        if (err) throw err;
    });
};

//==========================CONNECT TO DB, DISPLAY INVENTORY AND RUN PROGRAM======================================

//use promises to ensure correct order of operations

run().then((res) => {

	//display inventory and then start order intake process from customer
    displayInventory();

}).catch((err) => {

    if (err) throw err;

});


