const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Function to handle deposit
exports.processDeposit = functions.https.onCall(async (data, context) => {
  const userId = context.auth.uid;  // Ensure the user is authenticated
  const { plan, amount } = data;

  if (!userId || !plan || !amount) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
  }

  try {
    // Store the deposit information in Firestore
    const depositRef = db.collection('deposits').doc();
    await depositRef.set({
      userId: userId,
      plan: plan,
      amount: parseFloat(amount),
      status: 'pending',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { message: 'Deposit recorded successfully' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error processing deposit', error);
  }
});
