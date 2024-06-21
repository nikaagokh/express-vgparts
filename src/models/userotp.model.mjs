export class OtpUser {
    constructor(otp='', firstName='', lastName='', email='', password='') {
        this.otp = otp;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}