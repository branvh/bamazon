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

con.connect((err) => {

    if (err) throw err;

});

//================================FUNCTIONS========================================================================

const getInput = () => {

    inquirer.prompt([{
        type: 'list',
        name: 'ManagerChoice',
        message: 'What do you want to do?',
        choices: [
            'View Products for Sale',
            'View Low Inventory',
            'Add to Inventory',
            'Add Product'
        ]
    }]).then((res) => {

        let choice = res['ManagerChoice'];
        let command
        switch (choice) {

            case 'View Products for Sale':
                queryInventory('all');
                break;
            case 'View Low Inventory':
                queryInventory('low');
                break;
            case 'Add to Inventory':
                updateInventory();
                break;
            case 'Add Product':
                addProduct();
                break;


        }

    }).catch((err) => {
        if (err) throw err;
    });

}

const queryInventory = (queryLimit) => {

    let limit;
    if (queryLimit === 'all') {
        limit = 1000000;
    } else {
        limit = 5;
    }
    con.query('select * from products where stock_quantity<?', [limit], (err, res) => {

        displayInventory(res, queryLimit);

    });


}

const displayInventory = (data, command) => {

    let message = '';
    if (command === 'all') {
        message = 'CURRENT BAMAZON INVENTORY';
    } else message = 'CURRENT BAMAZON INVENTORY WITH <5 UNITS IN STOCK';

    console.log('\n');
    console.log('===========================' + message + '==========================');
    console.log('\n');

    data.forEach((item, index) => {

        let displayText = 'Product Name: ' + item['product_name'] + '\t\t Price: ' + item['price'] + '\t\t Stock: ' + item['stock_quantity'] + '\t\t Item ID: ' + item['item_id'] + ' ';
        console.log(displayText);

    });

    console.log('\n');
    console.log('===========================END OF LIST========================================');
    console.log('\n');

}

const updateInventory = () => {

    inquirer.prompt([{
        type: 'list',
        name: 'product_name',
        message: 'For which product are you adding more inventory?',
        choices: function() {

            return new Promise((resolve, reject) => {

                con.query('select product_name from products', (err, res) => {

                    let choiceArr = res.map((cur, ind) => {

                        return cur['product_name'];

                    });

                    resolve(choiceArr);

                })

            })
        }
    }, {
        name: 'stock_quantity',
        type: 'input',
        message: 'Input the number of units being added to stock'
    }]).then((res) => {

        let product = res['product_name'];
        let additionalUnits = parseInt(res['stock_quantity']);

        con.query('select stock_quantity from products where product_name=?', [product], (err, res) => {

            let oldAmount = parseInt(res[0]['stock_quantity']);
            let amount = oldAmount + additionalUnits;
            console.log(`Previous level was ${oldAmount} units and new inventory level is ${amount} units`);

            con.query('update products set stock_quantity=? where product_name=?', [amount, product], (err, res) => {

                if (err) throw err;

            });
        });


    }).catch((err) => {
        if (err) throw err;
    });

};


const addProduct = () => {

    inquirer.prompt([{
        name: 'product_name',
        type: 'input',
        message: 'Type the name of the new product'
    }, {
        name: 'department_name',
        type: 'input',
        message: 'Enter the product\'s department name'
    }, {
        name: 'price',
        type: 'input',
        message: 'Input the price, with the format of ##.##'
    }, {
        name: 'stock_quantity',
        type: 'input',
        message: 'Input the number of units'
    }]).then(function(answer) {
        con.query('insert into products set ?', {
            product_name: answer.product_name,
            department_name: answer.department_name,
            price: answer.price,
            stock_quantity: answer.stock_quantity
        }, function(err, res) {
            console.log("Your input was successful!");
        });
    });

}

//=============================RUN THE PROGRAM=====================================================================
getInput();
