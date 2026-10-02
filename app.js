import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
    apiKey: "AIzaSyBWCjzqC86X8f7HFf-yCrhiLpoZMROWSlE",
    authDomain: "brand-items.firebaseapp.com",
    projectId: "brand-items",
    storageBucket: "brand-items.firebasestorage.app",
    messagingSenderId: "705695809822",
    appId: "1:705695809822:web:e0469e2a5bac2a4458890f",
    measurementId: "G-084SH06PFR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log("Firebase Connected");


/* =========================
   PRODUCTS
========================= */

const demoProducts = [
    {
        id: 1,
        name: "প্রিমিয়াম কালো পাঞ্জাবি",
        category: "পুরুষ",
        price: 1290,
        image: "images/panjabi.jpg",
        description: "Premium quality Panjabi",
        stock: 10
    },
    {
        id: 2,
        name: "স্টাইলিশ ব্ল্যাক ওয়াচ",
        category: "অ্যাক্সেসরিজ",
        price: 1890,
        image: "images/watch.jpg",
        description: "Stylish black watch",
        stock: 10
    }
];


let products =
    JSON.parse(
        localStorage.getItem("brandItemsProducts")
    );


if (!Array.isArray(products)) {

    products = demoProducts;

    localStorage.setItem(
        "brandItemsProducts",
        JSON.stringify(products)
    );
}


let cart =
    JSON.parse(
        localStorage.getItem("brandItemsCart")
    ) || [];


/* =========================
   PRICE
========================= */

function formatPrice(price) {

    return Number(price).toLocaleString("bn-BD");

}


/* =========================
   PRODUCTS SHOW
========================= */

function renderProducts(filter = "সব") {

    const productGrid =
        document.getElementById("productGrid");

    if (!productGrid) return;


    products =
        JSON.parse(
            localStorage.getItem("brandItemsProducts")
        ) || [];


    productGrid.innerHTML = "";


    const filteredProducts =
        filter === "সব"
            ? products
            : products.filter(
                product =>
                    product.category === filter
            );


    if (filteredProducts.length === 0) {

        productGrid.innerHTML = `
            <p style="text-align:center;width:100%;padding:30px;">
                এই Category-তে কোনো Product নেই।
            </p>
        `;

        return;
    }


    filteredProducts.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.src='images/panjabi.jpg'"
                >

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description || ""}
                </p>


                <div class="product-bottom">

                    <strong>
                        ৳${formatPrice(product.price)}
                    </strong>


                    <button
                        onclick="addToCart(${product.id})"
                    >
                        কার্টে যোগ করুন
                    </button>

                </div>

            </div>
        `;


        productGrid.appendChild(card);

    });

}


/* =========================
   FILTER
========================= */

function filterProducts(category) {

    renderProducts(category);


    document
        .querySelectorAll(".filter")
        .forEach(button => {

            button.classList.remove("active");

            if (
                button.textContent.trim()
                === category
            ) {

                button.classList.add("active");

            }

        });


    const section =
        document.getElementById("products");

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================
   CART
========================= */

function addToCart(productId) {

    products =
        JSON.parse(
            localStorage.getItem("brandItemsProducts")
        ) || [];


    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {

        alert("Product পাওয়া যায়নি।");

        return;

    }


    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();

    updateCartCount();

    alert(
        `${product.name} Cart-এ যোগ হয়েছে।`
    );

}


/* =========================
   SAVE CART
========================= */

function saveCart() {

    localStorage.setItem(
        "brandItemsCart",
        JSON.stringify(cart)
    );

}


/* =========================
   CART COUNT
========================= */

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (cartCount) {

        cartCount.textContent = count;

    }

}


/* =========================
   OPEN CART
========================= */

function openCart() {

    const modal =
        document.getElementById(
            "cartModal"
        );


    if (!modal) return;


    renderCart();

    modal.classList.add("show");

}


/* =========================
   CLOSE CART
========================= */

function closeCart() {

    const modal =
        document.getElementById(
            "cartModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }

}


/* =========================
   SHOW CART
========================= */

function renderCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const cartTotal =
        document.getElementById(
            "cartTotal"
        );


    if (!cartItems || !cartTotal) return;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div style="text-align:center;padding:30px;">
                <p>আপনার Cart এখনো খালি।</p>
            </div>
        `;

        cartTotal.textContent = "0";

        return;

    }


    let total = 0;


    cartItems.innerHTML =
        cart.map(item => {

            const itemTotal =
                Number(item.price)
                * item.quantity;


            total += itemTotal;


            return `

                <div class="cart-item">

                    <div>

                        <strong>
                            ${item.name}
                        </strong>

                        <br>

                        <small>
                            ৳ ${formatPrice(item.price)}
                            × ${item.quantity}
                        </small>

                    </div>


                    <div>

                        <strong>
                            ৳ ${formatPrice(itemTotal)}
                        </strong>

                        <br>

                        <button
                            class="remove-cart"
                            onclick="removeFromCart(${item.id})"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            `;

        }).join("");


    cartTotal.textContent =
        formatPrice(total);

}


/* =========================
   REMOVE CART
========================= */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart();

    updateCartCount();

    renderCart();

}


/* =========================
   FIREBASE CHECKOUT
========================= */

async function checkout() {

    console.log("Checkout started");


    if (cart.length === 0) {

        alert("আপনার Cart খালি।");

        return;

    }


    const customerName =
        prompt("আপনার নাম লিখুন:");


    if (!customerName) return;


    const phone =
        prompt("আপনার মোবাইল নম্বর লিখুন:");


    if (!phone) return;


    const address =
        prompt(
            "আপনার সম্পূর্ণ ঠিকানা লিখুন:"
        );


    if (!address) return;


    const total =
        cart.reduce(
            (sum, item) =>
                sum
                + Number(item.price)
                * item.quantity,
            0
        );


    const order = {

        customerName:
            customerName.trim(),

        phone:
            phone.trim(),

        address:
            address.trim(),

        products:
            cart.map(item => ({

                id: item.id,

                name: item.name,

                category:
                    item.category || "",

                price:
                    Number(item.price),

                quantity:
                    Number(item.quantity),

                image:
                    item.image || ""

            })),

        total:
            Number(total),

        status:
            "নতুন",

        userId:
            auth.currentUser
                ? auth.currentUser.uid
                : null,

        createdAt:
            new Date().toISOString()

    };


    console.log(
        "Order:",
        order
    );


    try {

        const orderRef =
            await addDoc(
                collection(
                    db,
                    "orders"
                ),
                order
            );


        console.log(
            "Order ID:",
            orderRef.id
        );


        cart = [];


        saveCart();

        updateCartCount();

        renderCart();


        alert(
            "অর্ডার সফল হয়েছে! 🎉\n\nOrder ID: "
            + orderRef.id
        );


    } catch (error) {

        console.error(
            "Firebase Order Error:",
            error
        );


        alert(
            "অর্ডার করা যায়নি!\n\n"
            + error.message
        );

    }

}


/* =========================
   GLOBAL FUNCTIONS
========================= */

window.addToCart =
    addToCart;

window.openCart =
    openCart;

window.closeCart =
    closeCart;

window.removeFromCart =
    removeFromCart;

window.checkout =
    checkout;

window.filterProducts =
    filterProducts;


/* =========================
   MODAL
========================= */

window.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "cartModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeCart();

        }

    }
);


/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderProducts();

        updateCartCount();

    }
);