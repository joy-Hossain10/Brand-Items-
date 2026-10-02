import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyBWCjzqC86X8f7HFf-yCrhiLpoZMROWSlE",
    authDomain: "brand-items.firebaseapp.com",
    projectId: "brand-items",
    storageBucket: "brand-items.firebasestorage.app",
    messagingSenderId: "705695809822",
    appId: "1:705695809822:web:e0469e2a5bac2a4458890f",
    measurementId: "G-084SH06PFR"
};


const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);


const authArea =
    document.getElementById("authArea");


onAuthStateChanged(
    auth,
    function(user) {

        if (!authArea) return;


        if (user) {

            const name =
                user.displayName ||
                user.email ||
                "Customer";


            authArea.innerHTML = `

                <div class="user-menu">

                    <span class="user-name">
                        👤 ${name}
                    </span>

                    <a
                        href="profile.html"
                        class="profile-btn"
                    >
                        Profile
                    </a>

                    <button
                        id="headerLogout"
                        class="logout-header-btn"
                    >
                        Logout
                    </button>

                </div>

            `;


            document
                .getElementById("headerLogout")
                .addEventListener(
                    "click",
                    async function() {

                        try {

                            await signOut(auth);

                            window.location.reload();

                        } catch (error) {

                            console.error(error);

                            alert(
                                "Logout করা যায়নি।"
                            );

                        }

                    }
                );


        } else {

            authArea.innerHTML = `

                <a
                    href="login.html"
                    class="login-btn"
                >
                    Login
                </a>

            `;

        }

    }
);