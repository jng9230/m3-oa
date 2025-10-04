import type { FunctionComponent } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from '../firebase';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

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

    const handleClickCount = () => {
        setClickCount(clickCount => clickCount + 1)
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
        {authedUser && authedUser.uid}
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