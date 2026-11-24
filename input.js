
// JAVA KING ORDERING SYSTEM

// GET SAVED DATA
function getData(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
        return fallback;
    }
}

// PAGE 1: CUSTOMER INFORMATION

const customerForm = document.getElementById("customerForm");

if (customerForm) {

    customerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const customer = {
            name: document.getElementById("customerName").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value
        };

        localStorage.setItem(
            "javaCustomer",
            JSON.stringify(customer)
        );

        // Start a new order
        localStorage.setItem("javaCart", JSON.stringify([]));

        window.location.href = "orders.html";

    });
}


// PAGE 2: FOOD ORDERING

const cartItems = document.getElementById("cartItems");

let cart = getData("javaCart", []);

function addToCart(name, price) {

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();

    alert(name + " added to your order!");
}

function saveCart() {
    localStorage.setItem("javaCart", JSON.stringify(cart));
    displayCart();
}

function displayCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach((item, index) => {

        let subtotal = item.price * item.quantity;

        total += subtotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    ₱${item.price} x ${item.quantity}
                </div>

                <button onclick="removeItem(${index})">
                    Remove
                </button>
            </div>
        `;
    });

    document.getElementById("total").innerText =
        "Total: ₱" + total.toFixed(2);
}

function removeItem(index) {

    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
}


// CHECK CUSTOMER BEFORE OPENING MENU

if (cartItems) {

    const customer = getData("javaCustomer", null);

    if (!customer) {
        window.location.href = "index.html";
    } else {
        document.getElementById("welcomeCustomer").innerText =
            "Welcome, " + customer.name + "! Choose your favorite food.";
    }

    displayCart();
}


// PROCEED TO PAYMENT

function goToPayment() {

    if (cart.length === 0) {
        alert("Please add food to your order first!");
        return;
    }

    window.location.href = "payment.html";
}


// PAGE 3: PAYMENT SUMMARY

const paymentItems = document.getElementById("paymentItems");

if (paymentItems) {

    const customer = getData("javaCustomer", null);

    if (!customer) {
        window.location.href = "index.html";
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        window.location.href = "orders.html";
    } else {

        document.getElementById("customerSummary").innerHTML = `
            <p><strong>Name:</strong> ${escapeHTML(customer.name)}</p>
            <p><strong>Phone:</strong> ${escapeHTML(customer.phone)}</p>
            <p><strong>Address:</strong> ${escapeHTML(customer.address)}</p>
        `;

        let total = 0;

        cart.forEach(item => {

            let subtotal = item.price * item.quantity;

            total += subtotal;

            paymentItems.innerHTML += `
                <p>${escapeHTML(item.name)} x ${item.quantity}
                — ₱${subtotal.toFixed(2)}</p>
            `;
        });

        document.getElementById("paymentTotal").innerText =
            "Total: ₱" + total.toFixed(2);
    }
}


// BASIC TEXT SAFETY

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}


// CONFIRM ORDER

function placeOrder() {

    const selectedPayment =
        document.querySelector('input[name="payment"]:checked');

    if (!selectedPayment) {
        alert("Please select a payment method!");
        return;
    }

    const customer = getData("javaCustomer", {});
    const cart = getData("javaCart", []);

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    alert(
        "JAVA KING\n\n" +
        "ORDER SUCCESSFULLY PLACED!\n\n" +
        "Customer: " + customer.name + "\n" +
        "Payment: " + selectedPayment.value + "\n" +
        "Total: ₱" + total.toFixed(2) + "\n\n" +
        "Thank you for ordering!"
    );

    // Clear order after confirmation
    localStorage.removeItem("javaCart");
    localStorage.removeItem("javaCustomer");

    window.location.href = "index.html";
}
