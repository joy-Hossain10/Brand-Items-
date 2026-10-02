import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs
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


const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


// ===============================
// LOGIN CHECK
// ===============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    await loadProfile(user);
    await loadMyOrders(user.uid);

});


// ===============================
// PROFILE
// ===============================

async function loadProfile(user) {

    const nameElement =
        document.getElementById("profileName");

    const phoneElement =
        document.getElementById("profilePhone");

    const emailElement =
        document.getElementById("profileEmail");

    const uidElement =
        document.getElementById("profileUid");

    const avatarElement =
        document.getElementById("profileAvatar");


    // Authentication information

    nameElement.textContent =
        user.displayName || "Customer";

    emailElement.textContent =
        user.email || "";

    uidElement.textContent =
        user.uid;


    // Firestore information

    try {

        const userRef =
            doc(db, "users", user.uid);

        const userSnap =
            await getDoc(userRef);


        if (userSnap.exists()) {

            const data =
                userSnap.data();


            if (data.name) {
                nameElement.textContent =
                    data.name;
            }


            phoneElement.textContent =
                data.phone ||
                "Phone যোগ করা হয়নি";


            // Profile photo

            if (data.photo) {

                avatarElement.innerHTML = `
                    <img
                        src="${data.photo}"
                        alt="Profile Photo"
                    >
                `;

            }

        } else {

            phoneElement.textContent =
                "Phone যোগ করা হয়নি";

        }

    } catch (error) {

        console.error(
            "Profile Error:",
            error
        );

        phoneElement.textContent =
            "Phone যোগ করা হয়নি";

    }
}


// ===============================
// PROFILE PHOTO
// ===============================

const photoInput =
    document.getElementById("photoInput");


if (photoInput) {

    photoInput.addEventListener(
        "change",
        async function () {

            const file =
                this.files[0];

            if (!file) return;


            if (!file.type.startsWith("image/")) {

                alert("শুধু ছবি নির্বাচন করুন।");
                return;

            }


            // File size limit: 1 MB

            if (file.size > 1024 * 1024) {

                alert(
                    "ছবির সাইজ ১ MB-এর কম হতে হবে।"
                );

                return;

            }


            const user =
                auth.currentUser;

            if (!user) {

                alert("আগে Login করুন।");
                return;

            }


            const reader =
                new FileReader();


            reader.onload = async function () {

                const photo =
                    reader.result;


                // Preview

                document.getElementById(
                    "profileAvatar"
                ).innerHTML = `
                    <img
                        src="${photo}"
                        alt="Profile Photo"
                    >
                `;


                try {

                    await setDoc(
                        doc(
                            db,
                            "users",
                            user.uid
                        ),
                        {
                            photo: photo
                        },
                        {
                            merge: true
                        }
                    );


                    alert(
                        "Profile Photo সফলভাবে পরিবর্তন হয়েছে! ✅"
                    );


                } catch (error) {

                    console.error(
                        "Photo Save Error:",
                        error
                    );

                    alert(
                        "ছবি Save করা যায়নি।"
                    );

                }

            };


            reader.readAsDataURL(file);

        }
    );

}


// ===============================
// MY ORDERS
// ===============================

async function loadMyOrders(uid) {

    const ordersBox =
        document.getElementById("myOrders");


    ordersBox.innerHTML =
        "<p>Orders loading...</p>";


    try {

        const ordersQuery =
            query(
                collection(db, "orders"),
                where("userId", "==", uid)
            );


        const snapshot =
            await getDocs(ordersQuery);


        ordersBox.innerHTML = "";


        if (snapshot.empty) {

            ordersBox.innerHTML = `
                <div class="no-orders">

                    <p>
                        আপনার এখনো কোনো Order নেই।
                    </p>

                    <a href="index.html">
                        Shopping শুরু করুন
                    </a>

                </div>
            `;

            return;
        }


        snapshot.forEach((orderDoc) => {

            const order =
                orderDoc.data();


            const orderBox =
                document.createElement("div");

            orderBox.className =
                "my-order";


            const products =
                order.products || [];


            const productsHTML =
                products.map(product => `

                    <div class="my-order-product">

                        <img
                            src="${product.image || "images/panjabi.jpg"}"
                            alt="${product.name || "Product"}"
                        >

                        <div>

                            <strong>
                                ${product.name || ""}
                            </strong>

                            <p>
                                ৳${Number(
                                    product.price || 0
                                ).toLocaleString("bn-BD")}
                                ×
                                ${product.quantity || 1}
                            </p>

                        </div>

                    </div>

                `).join("");


            orderBox.innerHTML = `

                <div class="my-order-header">

                    <div>

                        <strong>
                            Order #${orderDoc.id}
                        </strong>

                        <br>

                        <small>
                            ${order.createdAt || ""}
                        </small>

                    </div>


                    <span class="order-status-badge">

                        ${order.status || "নতুন"}

                    </span>

                </div>


                <div class="order-products">

                    ${productsHTML}

                </div>


                <div class="my-order-total">

                    মোট:

                    <strong>
                        ৳${Number(
                            order.total || 0
                        ).toLocaleString("bn-BD")}
                    </strong>

                </div>

            `;


            ordersBox.appendChild(orderBox);

        });


    } catch (error) {

        console.error(
            "Orders Error:",
            error
        );


        ordersBox.innerHTML = `
            <p style="color:red;">
                Orders load করা যায়নি।
            </p>
        `;

    }

}