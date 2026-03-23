let products = JSON.parse(localStorage.getItem("products")) || [
    { name: "Apple", price: 10, stock: 10 },
    { name: "Banana", price: 5, stock: 10 },
    { name: "Milk", price: 50, stock: 10 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

// Save products
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(index) {
    let product = products[index];

    if (product.stock <= 0) {
        alert("Out of stock!");
        return;
    }

    let existingItem = cart.find(item => item.name === product.name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    product.stock--; // reduce stock

    saveProducts();
    updateCart();
    renderProducts();
}

function updateCart() {
    const cartList = document.getElementById("cart-list");
    const totalDisplay = document.getElementById("total");

    cartList.innerHTML = "";
    total = 0;

    cart.forEach((item, index) => {
        let li = document.createElement("li");

        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        li.innerHTML = `
            <strong>${item.name}</strong><br>
            ₱${item.price} x ${item.quantity} = ₱${itemTotal}<br>

            <button onclick="increaseQty(${index})">➕</button>
            <button onclick="decreaseQty(${index})">➖</button>
            <button onclick="removeItem(${index})">❌</button>
        `;

        cartList.appendChild(li);
    });

    totalDisplay.textContent = total;

    saveCart(); // 🔥 SAVE EVERY TIME CART CHANGES
}

function increaseQty(index) {
    let item = cart[index];
    let product = products.find(p => p.name === item.name);

    if (product.stock > 0) {
        item.quantity++;
        product.stock--;
    } else {
        alert("No more stock available!");
    }

    saveProducts();
    updateCart();
    renderProducts();
}

function decreaseQty(index) {
    let item = cart[index];
    let product = products.find(p => p.name === item.name);

    item.quantity--;
    product.stock++;

    if (item.quantity <= 0) {
        cart.splice(index, 1);
    }

    saveProducts();
    updateCart();
    renderProducts();
}

function removeItem(index) {
    let item = cart[index];
    let product = products.find(p => p.name === item.name);

    product.stock += item.quantity; // return stock

    cart.splice(index, 1);

    saveProducts();
    updateCart();
    renderProducts();
}   

function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    let cashInput = document.getElementById("cash").value;
    let cash = parseFloat(cashInput);

    if (isNaN(cash) || cash <= 0) {
        alert("Please enter a valid cash amount.");
        return;
    }

    if (cash < total) {
        alert("Not enough cash!");
        return;
    }

    let change = cash - total;

    // 🧾 Generate receipt content
    let receiptHTML = `
    <html>
    <head>
        <title>Receipt</title>
        <style>
            body {
                font-family: monospace;
                padding: 10px;
            }
            h2 {
                text-align: center;
            }
            hr {
                border: 1px dashed black;
            }
            ul {
                list-style: none;
                padding: 0;
            }
            li {
                margin: 5px 0;
            }
        </style>
    </head>
    <body>
        <h2>STORE RECEIPT</h2>
        <hr>
        <ul>
`;

cart.forEach(item => {
    receiptHTML += `
        <li>
            ${item.name}<br>
            ₱${item.price} x ${item.quantity} = ₱${item.price * item.quantity}
        </li>
    `;
});

receiptHTML += `
        </ul>
        <hr>
        <p>Total: ₱${total}</p>
        <p>Cash: ₱${cash}</p>
        <p>Change: ₱${change}</p>
        <hr>
        <p style="text-align:center;">Thank you!</p>
    </body>
    </html>
`;

    // 🪟 Open receipt in new window
    let receiptWindow = window.open("", "", "width=300,height=500");
    receiptWindow.document.write(receiptHTML);

    // 🖨️ Auto print
    receiptWindow.print();

    // Reset POS
    cart = [];
    total = 0;

    document.getElementById("cash").value = "";
    document.getElementById("change").textContent = "0";

    saveCart();
    updateCart();
}

// 🔥 LOAD CART WHEN PAGE OPENS
window.onload = function () {
    renderProducts();
    updateCart();
};

document.getElementById("cash").addEventListener("input", function () {
    let cash = parseFloat(this.value);
    let changeDisplay = document.getElementById("change");

    if (!isNaN(cash)) {
        let change = cash - total;
        changeDisplay.textContent = change >= 0 ? change : 0;
    } else {
        changeDisplay.textContent = "0";
    }
});

function renderProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach((product, index) => {
        let btn = document.createElement("button");

        btn.innerHTML = `
            <strong>${product.name}</strong><br>
            ₱${product.price}<br>
            Stock: ${product.stock}
        `;

        btn.onclick = function () {
            addToCart(index);
        };

        if (product.stock <= 0) {
            btn.disabled = true;
            btn.innerHTML += "<br>OUT";
        }

        productList.appendChild(btn);
    });
}

function addProduct() {
    let name = document.getElementById("pname").value;
    let price = parseFloat(document.getElementById("pprice").value);
    let stock = parseInt(document.getElementById("pstock").value);

    if (!name || isNaN(price) || isNaN(stock)) {
        alert("Please fill all fields correctly.");
        return;
    }

    products.push({ name, price, stock });

    saveProducts();
    renderProducts();

    // clear inputs
    document.getElementById("pname").value = "";
    document.getElementById("pprice").value = "";
    document.getElementById("pstock").value = "";
}