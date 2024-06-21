export const UserRole = {
    ADMIN:'admin',
    USER:'user',
    GUEST:'guest'
};

export class User {
    constructor(firstName='', lastName='', email='', password='', role='') {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
