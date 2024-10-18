const DILIMITER = ":";

class ParticipantModel {
    constructor() {
        this.firstName = "";
        this.lastName = "";
        this.gitlab = "";
        this.kaggle = "";
        this.date = "";
        this.gender = "";
        this.about = "";
        this.thinks = [];
        const today = new Date();
        this.registrationDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    }
    isOk() {
        if (this.firstName == "" || this.firstName.length > 200 || hasDilimiter(this.firstName)) return false;
        if (this.lastName == "" || this.lastName.length > 200 || hasDilimiter(this.lastName)) return false;
        if (this.gitlab == "" || this.firstName.length > 400 || hasDilimiter(this.gitlab)) return false;
        if (this.kaggle == "" || this.firstName.length > 400 || hasDilimiter(this.kaggle)) return false;

        if (this.about.length > 600 || hasDilimiter(this.about)) return false;
        if (this.gender != "other" && this.gender != "male" && this.gender != "female" && this.gender != "") return false;

        return true;
    }
}

function hasDilimiter(s) {
    return s.includes(DILIMITER);
}

module.exports.User = ParticipantModel;
