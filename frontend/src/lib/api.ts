import { auth } from '../firebase';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:3000';


export const updateCountRq = async () => {
    const user = auth.currentUser;
    if (!user){
        console.error("User isn't logged in");
        return {"status": 400};
    }

    try {
        const idToken = await user.getIdToken();
        const resp = await fetch(`${API}/api/increment-count`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
            },
            body: JSON.stringify({user: user})
        });

        if (!resp.ok){
            throw new Error(`API error: ${resp.statusText}`)
        }

        const data = await resp.json();
        console.log(data)
        return {"status": 200, "data": data};
    } catch (error) {
        console.error("Error incrementing click: ", error)
        return {"status": 400};
    }
}