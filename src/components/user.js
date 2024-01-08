class User {
    constructor(username, uid, points=0) {
        this.username = username
        this.uid = uid
        this.points = points
    }
    getName() {
        return this.first + ' ' + this.last
    }
    getPoints() {
        return this.points
    }
}

const userConverter = {
    toFirestore: (user) => {
        return {
            FIRST: this.first,
            LAST: this.last,
            UID: this.uid,
            POINTS: this.points
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        return new User(data.USERNAME, snapshot.id, data.POINTS)
    }
}