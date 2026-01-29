class User {
    constructor({ firstName, lastName, email, phoneNumber, passwordHash, 
        createdAt, updatedAt }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default User;
