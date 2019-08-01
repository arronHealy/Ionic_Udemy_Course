export class User {
    constructor(
        public id: string,
        public email: string,
        private _token: string,
        private tokenExpDate: Date

    ) { }

    get token() {
        if (!this.tokenExpDate || this.tokenExpDate <= new Date()) {
            return null;
        }
        return this._token;
    }
}