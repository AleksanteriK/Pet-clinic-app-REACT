module.exports = class Pet {
    constructor(id, ownerId, name, petType, status, dob, doctorsComment) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.petType = petType;
        this.status = status;
        this.dob = dob;
        //28.1.2024 AleksanteriK
        //added property for internal pet info
        this.doctorsComment = doctorsComment
    }

    getId() {
        return this.id;
    }

    getOwnerId() {
        return this.ownerId;
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.petType;
    }

    getStatus() {
        return this.status;
    }

    getDob() {
        return this.dob;
    }

    //28.1.2024 AleksanteriK
    //added getter for internal pet info
    getDoctorsComment() {
        return this.doctorsComment;
    }
}