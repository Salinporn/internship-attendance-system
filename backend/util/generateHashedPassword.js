
// This file is not part of the web app project. 
// It is a utility function that can be used in any project that requires password hashing.

const bcrypt = require("bcryptjs");

async function generateHashedPassword(password) {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(12);
        // Hash the password with the salt
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

// Example usage:
const plainTextPassword = "password123";
generateHashedPassword(plainTextPassword)
    .then(hash => {
        console.log("Hashed Password:", hash);
    })
    .catch(error => {
        console.error("Error:", error);
    });