if (window.localStorage.hasOwnProperty('cart') == false) { 
    cart = new Object();
} else {
    cart = JSON.parse(window.localStorage.getItem('cart')); 
} 
elements = Object.keys(cart).length; 
total = 0.; 
toppings = new Object(); 

toppings['pizza'] = ['Toppings', 'Pepperoni', 'Sausage', 'Mushrooms', 'Onions', 'Ham', 
                    'Canadian Bacon', 'Pineapple', 'Eggplant', 'Tomato & Basil', 
                    'Green Peppers','Hamburger', 'Spinach', 'Artichoke', 'Buffalo Chicken', 
                    'Barbecue Chicken','Anchovies', 'Black Olives', 'Fresh Garlic', 'Zucchini'];
toppings['sub'] = ['Extra Cheese'];
toppings['subs'] = ['Mushrooms', 'Green Peppers', 'Onions', 'Extra Cheese'];

// ADD TO CART
function addToCart(class_name, mtype, name, price, num_toppings, size, username) {
    elements += 1; 
	cart[elements] = new Object(); 

    const li = document.createElement('li'); 
    cart[elements]['class_name'] = class_name; 
    cart[elements]['mtype'] = mtype;
    cart[elements]['name'] = name;
    cart[elements]['size'] = size;
    cart[elements]['price'] = parseFloat(price);
    cart[elements]['n_toppings'] = parseInt(num_toppings);
    cart[elements]['toppings'] = [];
    cart[elements]['curr_top'] = 0;

    li.innerHTML =  class_name+' '+name+' ('+size+') '+price; 
    document.querySelector('#cartitems').append(li); 

    calcTotal(); 
    
    if (parseInt(num_toppings) > 0) {  
		addToppings(class_name, mtype, elements, username);
	}
    window.localStorage.setItem("cart", JSON.stringify(cart));  

    data='username='+username+'&cart='+JSON.stringify(cart);
    xhr = new XMLHttpRequest();
    xhr.open('POST', send_cart, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.send(data);
}

// ADD TOPPING 
function addToppings(class_name, mtype, el, username) {
    var txt = document.querySelector('#toppingsdiv').innerHTML; 
    var toadd = '<button type="button" class="btn btn-danger" onclick="closeTopps();">Close Toppings List</button><br><ul id="toppings"></ul>' // html tag to create a close button for the toppings list
    document.querySelector('#toppingsdiv').innerHTML = toadd + txt; 
	for (var i = toppings[mtype].length - 1; i >= 0; i--) { 
		const li = document.createElement('li');
		const aa = document.createElement('a');
    	aa.innerHTML = toppings[mtype][i];
    	aa.href = "#";

    	aa.onclick = function() { 
            var top = this.innerHTML;

            
            if (cart[el]['mtype'] == 'subs' || cart[el]['mtype'] == 'sub') {
                var twoPlacedFloat = + parseFloat(cart[el]['price']);
                cart[el]['price'] = twoPlacedFloat + 0.50;
            }

            cart[el]['curr_top'] += 1; 
            cart[el]['toppings'].push(top) 

            
            var text = cart[el]['class_name']+' '+cart[el]['name']+' ('+cart[el]['size']+') '+ 
                        cart[el]['price'] + ", " + cart[el]['toppings'].join(', ');
            document.querySelector('#cartitems').lastElementChild.innerHTML = text;

            
            calcTotal();

            
            if (cart[el]['n_toppings'] == cart[el]['curr_top']) {
                document.querySelector('#toppingsdiv').innerHTML = '';
            }

            window.localStorage.setItem("cart", JSON.stringify(cart)); 
            console.log('second push')
            data='username='+username+'&cart='+JSON.stringify(cart);
            xhr = new XMLHttpRequest();
            xhr.open('POST', send_cart, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.send(data);
        }
    	li.appendChild(aa); 
    	document.querySelector('#toppings').append(li); 
	}
}

// CLOSE TOPPINGS LIST 
function closeTopps() {
    document.querySelector('#toppingsdiv').innerHTML = '';
}

// CALCULATES TOTAL PRICE
function calcTotal() {
    total = 0.
    for (var el in cart) { 
        if (cart.hasOwnProperty(el)) {
            var twoPlacedFloat = + parseFloat(cart[el]['price']);
            total = total + twoPlacedFloat;
        }
    }
    text = "The current total is: "+total.toFixed(2).toString(); 
    document.querySelector('#total').innerHTML = text;
}

// SHOW CART 
function showCart() {
    request = new XMLHttpRequest();
    request.open('GET', get_cart, true); 
    cart = new Object();
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            console.log('good response')
            cart = JSON.parse(request.responseText);
            while (typeof(cart) != "object") {
                cart = JSON.parse(cart);
            }
            console.log(cart)

            total = 0.;
            for (var el in cart) { 
                console.log(el);
                if (cart.hasOwnProperty(el)) { 
                    const li = document.createElement('li');
                    li.innerHTML =  cart[el]['class_name']+' '+cart[el]['name']+' ('+cart[el]['size']+') '+ 
                                        cart[el]['price'].toString() + ", " + cart[el]['toppings'].join(', ');
                    document.querySelector('#cartitems').append(li);

                    var twoPlacedFloat = + parseFloat(cart[el]['price']); 
                    total = total + twoPlacedFloat;
                }
            }
            console.log('end of loop')
            text = "The current total is: "+total.toFixed(2).toString(); 
            document.querySelector('#total').innerHTML = text;
        } else { 
            console.log('there was a server error')
            
            
            if (window.localStorage.hasOwnProperty('cart') == false) {
                cart = new Object();
            } else {
                cart = JSON.parse(window.localStorage.getItem('cart'));
            } 

            total = 0.;

            for (var el in cart) { 
                console.log(el);
                if (cart.hasOwnProperty(el)) {
                    const li = document.createElement('li');
                    li.innerHTML =  cart[el]['class_name']+' '+cart[el]['name']+' ('+cart[el]['size']+') '+ 
                                        cart[el]['price'].toString() + ", " + cart[el]['toppings'].join(', ');
                    document.querySelector('#cartitems').append(li);

                    var twoPlacedFloat = + parseFloat(cart[el]['price']);
                    total = total + twoPlacedFloat;
                }
            }
            console.log('end of loop')
            text = "The current total is: "+total.toFixed(2).toString();
            document.querySelector('#total').innerHTML = text;
        };
    }
    request.onerror = function() {
        console.log('there was an error')
    };
    request.send();

    total = 0.;

    for (var el in cart) { 
        console.log(el);
        if (cart.hasOwnProperty(el)) {
            const li = document.createElement('li');
            li.innerHTML =  cart[el]['class_name']+' '+cart[el]['name']+' ('+cart[el]['size']+') '+ 
                                cart[el]['price'].toString() + ", " + cart[el]['toppings'].join(', ');
            document.querySelector('#cartitems').append(li);

            var twoPlacedFloat = + parseFloat(cart[el]['price']); 
            total = total + twoPlacedFloat;
        }
    }
    console.log('end of loop')
    text = "The current total is: "+total.toFixed(2).toString(); 
    document.querySelector('#total').innerHTML = text; 
}

// FILL CART 
function fillCart() {
    total = 0.;
    document.querySelector('#subcartitems').innerHTML = '';
    for (var el in cart) { 
        if (cart.hasOwnProperty(el)) {
            const li = document.createElement('li');
            li.innerHTML =  cart[el]['class_name']+' '+cart[el]['name']+' ('+cart[el]['size']+') '+ 
                                cart[el]['price'].toString() + ", " + cart[el]['toppings'].join(', ');
            document.querySelector('#subcartitems').append(li);

            var twoPlacedFloat = + parseFloat(cart[el]['price']); 
            total = total + twoPlacedFloat;
        }
    }
    text = "The current total is: "+total.toFixed(2).toString();
    document.querySelector('#subtotal').innerHTML = text; 
}