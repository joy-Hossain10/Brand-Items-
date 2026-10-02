import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
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


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* =========================
   ORDERS LOAD
========================= */

async function loadOrders() {

    const ordersContainer =
        document.getElementById("ordersContainer");

    if (!ordersContainer) return;


    ordersContainer.innerHTML =
        "<p>Orders loading...</p>";


    try {

        const ordersQuery = query(
            collection(db, "orders"),
            orderBy("createdAt", "desc")
        );


        const snapshot =
            await getDocs(ordersQuery);


        ordersContainer.innerHTML = "";


        if (snapshot.empty) {

            ordersContainer.innerHTML = `
                <div class="empty-orders">
                    <h3>এখনো কোনো Order নেই</h3>
                    <p>Customer Order করলে এখানে দেখা যাবে।</p>
                </div>
            `;

            return;
        }


        snapshot.forEach(orderDoc => {

            const order =
                orderDoc.data();

            const orderId =
                orderDoc.id;


            const box =
                document.createElement("div");

            box.className = "order-box";


            const productsHTML =
                (order.products || [])
                .map(product => `

                    <div class="order-product">

                        <img
                            src="${product.image || "images/panjabi.jpg"}"
                            alt="${product.name || "Product"}"
                        >

                        <div>

                            <strong>
                                ${product.name || ""}
                            </strong>

                            <p>
                                ৳${Number(product.price || 0).toLocaleString("bn-BD")}
                                × ${product.quantity || 1}
                            </p>

                        </div>

                    </div>

                `)
                .join("");


            box.innerHTML = `

                <div class="order-header">

                    <div>

                        <h3>
                            Order #${orderId}
                        </h3>

                        <small>
                            ${order.createdAt || ""}
                        </small>

                    </div>


                    <select
                        class="order-status"
                        data-id="${orderId}"
                    >

                        <option value="নতুন"
                            ${order.status === "নতুন" ? "selected" : ""}>
                            নতুন
                        </option>

                        <option value="কনফার্ম"
                            ${order.status === "কনফার্ম" ? "selected" : ""}>
                            কনফার্ম
                        </option>

                        <option value="ডেলিভারিতে"
                            ${order.status === "ডেলিভারিতে" ? "selected" : ""}>
                            ডেলিভারিতে
                        </option>

                        <option value="ডেলিভারি সম্পন্ন"
                            ${order.status === "ডেলিভারি সম্পন্ন" ? "selected" : ""}>
                            ডেলিভারি সম্পন্ন
                        </option>

                        <option value="বাতিল"
                            ${order.status === "বাতিল" ? "selected" : ""}>
                            বাতিল
                        </option>

                    </select>

                </div>


                <div class="customer-info">

                    <h4>Customer Information</h4>

                    <p>
                        <strong>নাম:</strong>
                        ${order.customerName || ""}
                    </p>

                    <p>
                        <strong>ফোন:</strong>
                        ${order.phone || ""}
                    </p>

                    <p>
                        <strong>ঠিকানা:</strong>
                        ${order.address || ""}
                    </p>

                </div>


                <div class="order-products">

                    <h4>Products</h4>

                    ${productsHTML}

                </div>


                <div class="order-total">

                    মোট:
                    <strong>
                        ৳${Number(order.total || 0).toLocaleString("bn-BD")}
                    </strong>

                </div>


                <button
                    class="delete-order"
                    data-id="${orderId}"
                >
                    🗑️ Order Delete
                </button>

            `;


            ordersContainer.appendChild(box);

        });


        /* STATUS CHANGE */

        document
            .querySelectorAll(".order-status")
            .forEach(select => {

                select.addEventListener(
                    "change",
                    async function () {

                        const id =
                            this.dataset.id;

                        const newStatus =
                            this.value;


                        try {

                            await updateDoc(
                                doc(
                                    db,
                                    "orders",
                                    id
                                ),
                                {
                                    status:
                                        newStatus
                                }
                            );


                            alert(
                                "Order Status পরিবর্তন হয়েছে।"
                            );


                        } catch (error) {

                            console.error(error);

                            alert(
                                "Status পরিবর্তন করা যায়নি।"
                            );

                        }

                    }
                );

            });


        /* DELETE */

        document
            .querySelectorAll(".delete-order")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    async function () {

                        const id =
                            this.dataset.id;


                        const confirmDelete =
                            confirm(
                                "এই Order টি Delete করতে চান?"
                            );


                        if (!confirmDelete) return;


                        try {

                            await deleteDoc(
                                doc(
                                    db,
                                    "orders",
                                    id
                                )
                            );


                            alert(
                                "Order Delete হয়েছে।"
                            );


                            loadOrders();


                        } catch (error) {

                            console.error(error);

                            alert(
                                "Order Delete করা যায়নি।"
                            );

                        }

                    }
                );

            });


    } catch (error) {

        console.error(
            "Orders Error:",
            error
        );


        ordersContainer.innerHTML = `
            <div class="empty-orders">

                <h3>
                    Orders Load করা যায়নি
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

    }

}


/* START */

document.addEventListener(
    "DOMContentLoaded",
    loadOrders
);