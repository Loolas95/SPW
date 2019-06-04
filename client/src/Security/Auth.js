class Auth {

    static authenticateUser(token, username, role) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
    }

    static isUserAuthenticated() {

        let date = new Date().getTime() / 1000;
        if (localStorage.getItem('token') !== null) {

            if (date > this.getExpirationTime()) this.deauthenticateUser();

        }
        return localStorage.getItem('token') !== null;

    }

    static deauthenticateUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getUsername() {
        return localStorage.getItem('username');
    }

    static getRole() {
        return localStorage.getItem('role');
    }

    static getExpirationTime() {
        let base64Url = this.getToken().split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        let jwt = JSON.parse(window.atob(base64));
        let array = Object.values(jwt);
        return array[1];
    };

}

export default Auth;