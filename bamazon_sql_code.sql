create database bamazon;
use bamazon;

create table products (
	item_id integer(10) auto_increment not null,
    product_name varchar(30) not null,
    department_name varchar(30) not null,
    price decimal(10,2) not null,
    stock_quantity integer(10) not null,
    primary key (item_id)	
);

insert into products (product_name, department_name, price, stock_quantity) values ('plasma tv', 'electronics', '450.99', '10');
insert into products (product_name, department_name, price, stock_quantity) values ('xbox one', 'electronics', '599.99', '5');
insert into products (product_name, department_name, price, stock_quantity) values ('google pixel', 'electronics', '699.99', '2');
insert into products (product_name, department_name, price, stock_quantity) values ('jbl speakers', 'electronics', '83', '15');
insert into products (product_name, department_name, price, stock_quantity) values ('persian rug', 'furniture', '2075', '1');
insert into products (product_name, department_name, price, stock_quantity) values ('leather couch', 'furniture', '1349.98', '4');
insert into products (product_name, department_name, price, stock_quantity) values ('large vase', 'furniture', '219.97', '3');
insert into products (product_name, department_name, price, stock_quantity) values ('toothbrush', 'household goods', '2.99', '30');
insert into products (product_name, department_name, price, stock_quantity) values ('deoderant', 'household goods', '4.99', '50');
insert into products (product_name, department_name, price, stock_quantity) values ('shampoo', 'household goods', '6.99', '20');

select * from products;

select price from products where id='1';

update products set stock_quantity=18 where item_id='1';

select (stock_quantity) from products where item_id=1;