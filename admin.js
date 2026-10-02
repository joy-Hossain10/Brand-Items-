// ==========================================
// BRAND ITEMS - FIREBASE ADMIN
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBWCjzqC86X8f7HFf-yCrhiLpoZMROWSlE",
    authDomain: "brand-items.firebaseapp.com",
    projectId: "brand-items",
    storageBucket: "brand-items.firebasestorage.app",
    messagingSenderId: "705695809822",
    appId: "1:705695809822:web:e0469e2a5bac2a4458890f",
    measurementId: "G-084SH06PFR"
};


// Firebase শুরু
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// HTML elements
const productForm =
    document.getElementById("productForm");

const adminProductList =
    document.getElementById("adminProductList");

const adminMessage =
    document.getElementById("adminMessage");

const imageInput =
    document.getElementById("productImage");

const imagePreview =
    document.getElementById("imagePreview");


let selectedImage = "";


// ==========================================
// IMAGE PREVIEW
// ==========================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file = this.files[0];

            if (!file) {
                selectedImage = "";

                if (imagePreview) {
                    imagePreview.src = "";
                    imagePreview.style.display = "none";
                }

                return;
            }

            if (!file.type.startsWith("image/")) {
                alert("শুধু Image নির্বাচন করুন।");
                this.value = "";
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {

                selectedImage =
                    event.target.result;

                if (imagePreview) {
                    imagePreview.src =
                        selectedImage;

                    imagePreview.style.display =
                        "block";
                }
            };

            reader.readAsDataURL(file);
        }
    );
}


// ==========================================
// FIREBASE থেকে PRODUCTS LOAD
// ==========================================

async function showProducts() {

    if (!adminProductList) return;

    adminProductList.innerHTML =
        "<p>Products loading...</p>";

    try {

        const querySnapshot =
            await getDocs(
                collection(db, "products")
            );

        adminProductList.innerHTML = "";

        if (querySnapshot.empty) {

            adminProductList.innerHTML = `
                <p>
                    এখনো কোনো Product Add করা হয়নি।
                </p>
            `;

            return;
        }


        querySnapshot.forEach(
            function (documentSnapshot) {

                const product =
                    documentSnapshot.data();

                const item =
                    document.createElement("div");

                item.className =
                    "admin-product-item";

                item.innerHTML = `

                    <img
                        src="${product.image || "images/panjabi.jpg"}"
                        alt="${product.name || "Product"}"
                    >

                    <div class="admin-product-info">

                        <h3>
                            ${product.name || ""}
                        </h3>

                        <p>
                            Category:
                            ${product.category || ""}
                        </p>

                        <p>
                            Price:
                            ৳${product.price || 0}
                        </p>

                        <p>
                            Stock:
                            ${product.stock || 0}
                        </p>

                    </div>

                    <button
                        class="delete-product"
                        data-id="${documentSnapshot.id}"
                    >
                        Delete
                    </button>
                `;


                const deleteButton =
                    item.querySelector(
                        ".delete-product"
                    );


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteProduct(
                            documentSnapshot.id
                        );

                    }
                );


                adminProductList.appendChild(item);

            }
        );

    } catch (error) {

        console.error(error);

        adminProductList.innerHTML = `
            <p style="color:red;">
                Products load করা যায়নি।
            </p>
        `;

    }
}


// ==========================================
// PRODUCT ADD
// ==========================================

if (productForm) {

    productForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("productName")
                    .value
                    .trim();


            const category =
                document
                    .getElementById("productCategory")
                    .value;


            const price =
                Number(
                    document
                        .getElementById("productPrice")
                        .value
                );


            const description =
                document
                    .getElementById(
                        "productDescription"
                    )
                    .value
                    .trim();


            const stock =
                Number(
                    document
                        .getElementById(
                            "productStock"
                        )
                        .value
                );


            if (!selectedImage) {

                alert(
                    "Product-এর একটি Image নির্বাচন করুন।"
                );

                return;
            }


            const newProduct = {

                name: name,

                category: category,

                price: price,

                description: description,

                stock: stock,

                image: selectedImage,

                createdAt:
                    new Date().toISOString()
            };


            try {

                await addDoc(
                    collection(db, "products"),
                    newProduct
                );


                if (adminMessage) {

                    adminMessage.style.color =
                        "green";

                    adminMessage.textContent =
                        "Product Firebase-এ সফলভাবে Add হয়েছে!";
                }


                productForm.reset();

                selectedImage = "";


                if (imagePreview) {

                    imagePreview.src = "";

                    imagePreview.style.display =
                        "none";
                }


                const stockInput =
                    document.getElementById(
                        "productStock"
                    );


                if (stockInput) {
                    stockInput.value = 10;
                }


                await showProducts();


            } catch (error) {

                console.error(error);

                if (adminMessage) {

                    adminMessage.style.color =
                        "red";

                    adminMessage.textContent =
                        "Product Add করা যায়নি।";
                }

                alert(
                    "Firebase Error: " +
                    error.message
                );
            }

        }
    );
}


// ==========================================
// PRODUCT DELETE
// ==========================================

async function deleteProduct(productId) {

    const confirmDelete =
        confirm(
            "এই Product টি Delete করতে চান?"
        );


    if (!confirmDelete) return;


    try {

        await deleteDoc(
            doc(
                db,
                "products",
                productId
            )
        );


        if (adminMessage) {

            adminMessage.style.color =
                "green";

            adminMessage.textContent =
                "Product Delete করা হয়েছে।";
        }


        await showProducts();


    } catch (error) {

        console.error(error);

        alert(
            "Product Delete করা যায়নি: " +
            error.message
        );
    }
}


// ==========================================
// START
// ==========================================

showProducts();