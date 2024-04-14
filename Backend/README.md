Welcome to E-Cart ! Here is a little help for you to better understand how to use our services : 

Due to some issues with my computer the project is not as advanced as I wish it would, but still there is solid bases and more that all the business use cases are implemented. 


The link of our service is on the port 3000 : https://localhost:3000/

General requests : 
________________________________
GET requests : 

/               ->  Presentation page
/health         ->  Services state



_________________________________

User requests : /users

_______________
GET requests :

/               -> Returns all the users
/:userId        -> Returns the user with the ID

_______________
POST requests : 
/create         -> creates a user

json : 
{
    "name" : "Test1"
}

_______________
DELETE requests : 

/:userId/del    -> Delete the user by Id


_________________________________

Carts Requests : /carts
_______________
GET requests :

/all            -> returns all the carts
/:id            -> returns the cart by id


________________
POST requests : 

/create         -> creates a new cart

json : 
{
    "name" : "cartTest",
    "userId" : 1
}

/add            -> add product to your cart

json : 
{
    "cartId" : 1004,
    "productId" : 2
}

/share          -> share your cart with another user

json : 
{
    "cartId" : 1004,
    "userId" : 2
}

_________________
PUT requests :

/:id/update     -> update your cart as you want 

json : 
{
    "name" : "testcart2",
    "collaborators" : [],
    "products" : [1,1,1]
}

_________________
DELETE request : 

/:id/del        -> delete the cart with it's id

_______________________________

Products requests : /products

______________
GET requests :

/all            -> returns all the products
/:id            -> returns the product with the id


________________
POST requests : 

/create         -> creates a product

json : 
{
    "name":"fish",
    "price" : 6.99 
}

________________
PUT requests :

/:id/update     -> update the information as you wish
json
{
    "name":"salmon",
    "price" : 7.99 
}

_______________
DELETE request : 

/:id/del        -> delete the product with the id

______________________________________________________


It the end of this presentation. 

(Have a great day :)
