// server.js or app.js (Node.js/Express server)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();

// Initialize Firebase Admin SDK with service account key
const serviceAccount = require('./stacks-517bd-01c83118b274.json'); // Ensure this path is correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stacks-517bd-default-rtdb.firebaseio.com" // Ensure this URL is correct
});

const auth = admin.auth();
const database = admin.database();

app.use(cors());
app.use(bodyParser.json());

// Route to delete a user
app.delete('/deleteUser', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email is required' });
  }
  try {
    const userRecord = await auth.getUserByEmail(email);
    await auth.deleteUser(userRecord.uid);
    res.status(200).json({ status: 'success', message: `User ${email} deleted` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ status: 'error', message: `Error deleting user: ${error.message}` });
  }
});

// Route to disable a user
app.put('/disableUser', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email is required' });
  }
  try {
    const userRef = database.ref('Employee_Account').orderByChild('email').equalTo(email);
    const snapshot = await userRef.once('value');
    snapshot.forEach(async (childSnapshot) => {
      await childSnapshot.ref.update({ disabled: true });
    });
    res.status(200).json({ status: 'success', message: `User ${email} disabled` });
  } catch (error) {
    console.error('Error disabling user:', error);
    res.status(500).json({ status: 'error', message: `Error disabling user: ${error.message}` });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stacks-517bd-default-rtdb.firebaseio.com", 
  projectId: "stacks-517bd" // Add your project ID here explicitly
});