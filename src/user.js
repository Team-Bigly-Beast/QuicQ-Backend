class User {
    constructor(body, accessKey) {
        this.userName = body.id;
        this.profilePicture = body.images[0].url
        this.accessKey = accessKey;
        this.premium = body.product;
    }
    getImage() { return this.profilePicture; }
    getUserName() { return this.userName; }
    getAccessKey() { return this.accessKey; }
    isPremium() { return this.premium }
}

module.exports= User