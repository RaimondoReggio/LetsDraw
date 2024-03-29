const admin = require("firebase-admin");
const credentials = require("./key.json");
const { FieldValue } = require("@google-cloud/firestore");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const db = admin.firestore();

async function getTopics() {
    var categories = [];
    const query = topicCollection = db.collection('topics');
    const value = query.get().then(snapshot => {
        if(!snapshot.empty) {
            snapshot.forEach(name => {
                categories.push(name.data().name);
            });
            return categories;
        } else {
            return false;
        }
    }).catch(error => {
        console.log(error);
    })
    return value;
}

function updateScoreboard(id, value) {
    console.log("UPDATO: " + id);
    db.collection('scoreboard').doc(id).update({
        scoreW: FieldValue.increment(value),
        scoreM: FieldValue.increment(value),
        scoreA: FieldValue.increment(value)
    }).then((writeResult) => {console.log(writeResult)});
};

module.exports = {getTopics, updateScoreboard};