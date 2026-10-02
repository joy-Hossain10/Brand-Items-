import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


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

const auth = getAuth(app);

const db = getFirestore(app);


console.log("Brand Items Auth Connected");


/* =========================
   REGISTER
========================= */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("registerPhone")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            if (password.length < 6) {

                message.style.color = "red";

                message.textContent =
                    "Password কমপক্ষে ৬ অক্ষরের হতে হবে।";

                return;
            }


            if (password !== confirmPassword) {

                message.style.color = "red";

                message.textContent =
                    "Password মিলছে না।";

                return;
            }


            try {

                message.style.color = "#555";

                message.textContent =
                    "Account তৈরি হচ্ছে...";


                /* CREATE AUTH ACCOUNT */

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                /* SAVE NAME IN FIREBASE AUTH */

                await updateProfile(
                    user,
                    {
                        displayName: name
                    }
                );


                /*
                 * SAVE CUSTOMER INFORMATION
                 *
                 * এটি ব্যর্থ হলেও Registration
                 * বন্ধ হবে না।
                 */

                try {

                    await setDoc(
                        doc(
                            db,
                            "users",
                            user.uid
                        ),
                        {
                            uid: user.uid,
                            name: name,
                            phone: phone,
                            email: email,
                            createdAt:
                                new Date().toISOString()
                        }
                    );

                } catch (firestoreError) {

                    console.warn(
                        "User profile save failed:",
                        firestoreError
                    );

                }


                message.style.color = "green";

                message.textContent =
                    "Account সফলভাবে তৈরি হয়েছে!";


                setTimeout(
                    function() {

                        window.location.href =
                            "profile.html";

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Registration Error:",
                    error
                );


                message.style.color = "red";


                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    message.textContent =
                        "এই Email দিয়ে আগে থেকেই Account আছে।";

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message.textContent =
                        "Email ঠিক নয়।";

                }

                else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    message.textContent =
                        "Password কমপক্ষে ৬ অক্ষরের হতে হবে।";

                }

                else {

                    message.textContent =
                        "Registration Error: " +
                        error.message;

                }

            }

        }
    );

}


/* =========================
   LOGIN
========================= */

window.loginUser =
    async function() {

        const emailElement =
            document.getElementById(
                "loginEmail"
            );


        const passwordElement =
            document.getElementById(
                "loginPassword"
            );


        if (!emailElement || !passwordElement) {

            alert(
                "Login form পাওয়া যায়নি।"
            );

            return;

        }


        const email =
            emailElement.value.trim();


        const password =
            passwordElement.value;


        if (!email || !password) {

            alert(
                "Email এবং Password দিন।"
            );

            return;

        }


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            alert(
                "Login সফল হয়েছে! 🎉"
            );


            window.location.href =
                "profile.html";


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                alert(
                    "Email অথবা Password ভুল।"
                );

            }

            else {

                alert(
                    "Login Error: " +
                    error.message
                );

            }

        }

    };


/* =========================
   LOGOUT
========================= */

window.logoutUser =
    async function() {

        try {

            await signOut(auth);

            window.location.href =
                "index.html";

        } catch (error) {

            console.error(error);

            alert(
                "Logout Error: " +
                error.message
            );

        }

    };


/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(
    auth,
    function(user) {

        if (user) {

            console.log(
                "Logged in:",
                user.email
            );

        } else {

            console.log(
                "No user logged in"
            );

        }

    }
);