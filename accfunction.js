const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteUser = functions.https.onCall(async (data, context) => {
  try {
    const userEmail = data.email;
    const user = await admin.auth().getUserByEmail(userEmail);
    await admin.auth().deleteUser(user.uid);
    return { message: `User ${userEmail} deleted successfully.` };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', error.message, error);
  }
});