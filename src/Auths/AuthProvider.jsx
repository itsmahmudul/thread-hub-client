import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { auth } from '../Firebase/firebase.config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';


const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved === "true" || false;
    });

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const updateUserProfile = profileInfo => {
        return updateProfile(auth.currentUser, profileInfo);
    }

    const logOutUser = () => {
        setLoading(true);
        return signOut(auth);
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const res = await fetch(`http://localhost:5000/users/${currentUser.email}`);
                    const mongoUser = await res.json();

                    // Extend the original Firebase user with Mongo fields
                    const enrichedUser = {
                        ...currentUser, // ⬅️ Keep Firebase token & methods
                        subscription: mongoUser.subscription || "free",
                        authorName: mongoUser.authorName,
                        authorImage: mongoUser.authorImage,
                    };

                    setUser(enrichedUser);
                } catch (err) {
                    console.error("Failed to load MongoDB user:", err);
                    setUser(currentUser); // fallback
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unSubscribe();
    }, []);

    useEffect(() => {
        const className = "dark";
        const htmlElement = document.documentElement;
        if (darkMode) {
            htmlElement.classList.add(className);
        } else {
            htmlElement.classList.remove(className);
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const userInfo = {
        darkMode,
        user,
        toggleDarkMode,
        createUser,
        signInUser,
        googleSignIn,
        logOutUser,
        updateUserProfile,
        loading
    }

    return (
        <>
            <AuthContext.Provider value={userInfo}>
                {children}
            </AuthContext.Provider>
        </>
    );
};

export default AuthProvider;