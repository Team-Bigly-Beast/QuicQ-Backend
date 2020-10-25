const User = require('./user.js')

class Room {
    constructor(id, pass, owner) {
        this.id = id;
        this.owner = owner;
        this.password = pass;
        this.userList = new Map;
        this.userList.set(this.owner.getAccessKey(), owner);
    }
    addUser(user) {
        if (this.userList.has(user)) {
            return;
        }
        this.userList.set(user, user);
    }
    getUser(access_token) { return this.userList.has(access_token); }
    getOwner() { return this.owner; }
    getRoomID() { return this.id; }
    getRoomPassword() { return this.password; }
}

module.exports = Room;