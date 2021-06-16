import User from "./user"

export default class Room {

    id: String;
    owner: User;
    password: String;
    userList: Map<String, User>;

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
    getOwner(): User { return this.owner; }
    getRoomID(): String { return this.id; }
    getRoomPassword(): String { return this.password; }
}