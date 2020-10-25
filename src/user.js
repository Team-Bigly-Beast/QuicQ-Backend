class User {
    constructor(body, accessKey) {
        this.userName = body.id;
        try {
            this.profilePicture = body.images[0].url
        }
        catch (error) {
            this.profilePicture = "https://www.robertreeveslaw.com/wp-content/uploads/2015/11/Donald-Trump-Finger.jpg";
        }
        this.accessKey = accessKey;
        this.premium = body.product;
    }
    getImage() { return this.profilePicture; }
    getUserName() { return this.userName; }
    getAccessKey() { return this.accessKey; }
    isPremium() { return this.premium }
}

module.exports= User