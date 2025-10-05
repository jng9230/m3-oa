import type { FunctionComponent } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from '../firebase';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { updateCountRq } from "@/lib/api";
import { db } from "../firebase";
import { doc, onSnapshot } from 'firebase/firestore'; 

interface DashboardProps {
    
}

const Dashboard: FunctionComponent<DashboardProps> = () => {
    const navigate = useNavigate();

    const [authedUser, setAuthedUser] = useState<User>();
    const [clickCount, setClickCount] = useState(0);

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              const uid = user.uid;
              console.log("uid", uid)
              console.log(user)
              setAuthedUser(user);
            } else {
              console.log("user is logged out")
            }
          });
    }, [])

    useEffect(() => {
        // If no user is logged in, reset count and stop loading
        if (!authedUser) {
          setClickCount(0);
          return;
        }
    
        // Reference to the specific user's document in the 'users' collection
        const userDocRef = doc(db, 'users', authedUser.uid);
    
        // Set up a real-time listener (onSnapshot)
        onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // console.log("BACKEND DATA")
                // console.log(data);
                setClickCount(parseInt(data.clickCount) || 0);
                
            // Document DNE (e.g., brand new user or first click hasn't happened yet)
            } else {
                console.log("User document not found in Firestore or has no clickCount.");
                setClickCount(0);
            }
        }, (error) => {
            console.error("Error fetching user click count from Firestore:", error);
        });
      }, [authedUser]);

    const handleClickCount = () => {
        updateCountRq()
            .then(d => {
                console.log(d);
                // ----- let onSnapshot handle count
                // if (d.status === 200){
                //     setClickCount(parseInt(d.data))
                // }
            })
            .catch(() => {}) // API already handles errs
        }

    const handleLogout = () => {
        signOut(auth).then(() => {
                navigate("/");
                console.log("Signed out successfully")
            }).catch((error) => {
                console.error(error)
            });
    }

    return ( <>
        {/* {authedUser && authedUser.uid} */}
        <div>
            <p>
                Hello {authedUser?.email}!
            </p>
            <p>
                Click count: {clickCount}
            </p>
            <Button onClick={() => handleClickCount()}> Click </Button>
        </div>

        <div className="mt-10">
            <Button onClick={() => handleLogout()}> Logout </Button>
        </div>
        </> );
}
 
export default Dashboard;