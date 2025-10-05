import express, { type Request, type Response } from 'express';
import { initializeApp } from 'firebase-admin/app';
import 'dotenv/config'
import cors from 'cors';
import admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';
import { Auth } from 'firebase-admin/auth';

if (!admin.apps.length) {
    // local env -> use service key
    if (process.env.NODE_ENV === 'development' && process.env.FB_SVC_ACCOUNT_PATH) {
        const serviceAccount = process.env.FB_SVC_ACCOUNT_PATH;
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

    // use default creds for cloud env
    } else {
        admin.initializeApp();
    }
}
export const db = admin.firestore();
export const auth = admin.auth();

async function verifyFirebaseToken(req: Request, res: Response, next: any) {
    console.log(`[verifyFirebaseToken]`)
    const authHeader = req.headers.authorization;

    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("[verifyFirebaseToken] invalid format")
        return res.status(401).send('Unauthorized: No token provided or invalid format.');
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (typeof idToken !== "string"){
        console.log("[verifyFirebaseToken] invalid id token")
        return res.status(401).send('Unauthorized: Invalid or expired token.');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        (req as any).user = decodedToken; // attach the .user for use later
        next();
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        return res.status(401).send('Unauthorized: Invalid or expired token.');
    }
}


const app = express();
const port = process.env.PORT;
app.use(cors({ origin: 'http://localhost:5173' }));



app.post('/api/increment-count', verifyFirebaseToken, async (req: Request, res: Response) => {
    console.log("[/api/increment-count]")
    const userId = (req as any).user.uid;

    try {
        const userRef = db.collection('users').doc(userId);
        await userRef.set({
            clickCount: admin.firestore.FieldValue.increment(1)
        }, { merge: true });

        return res.status(200).json({ message: 'Click count incremented', userId: userId });
    } catch (error) {
        console.error('Error updating click count:', error);
        return res.status(500).send('Internal Server Error.');
    }
});


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});