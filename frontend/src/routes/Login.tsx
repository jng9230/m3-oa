import { type FunctionComponent, useState } from "react";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
  } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from "@/components/ui/button";

interface LoginProps {
    
}



const Login: FunctionComponent<LoginProps> = () => {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    
    const handleAccountCreation = async () => {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                navigate("/dashboard")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage);
            });
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                navigate("/dashboard")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage);
            });

    }
    return (<>
        <div className="w-full max-w-md">
            <FieldSet>
                <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="text" placeholder="" onChange={e => setEmail(e.target.value)}/>
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" placeholder="" onChange={e => setPassword(e.target.value)} />
                </Field>
                <div className="flex w-full justify-around">
                    <Button onClick={() => handleAccountCreation()}> Create Account </Button>
                    <Button onClick={() => handleLogin()}> Login </Button>
                </div>
                </FieldGroup>
            </FieldSet>
        </div>
    </>);
}
 
export default Login;