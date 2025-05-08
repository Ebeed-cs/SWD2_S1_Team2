
import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword,getAuth,signInWithEmailAndPassword}from 'firebase/auth';
import{getFirestore,setDoc} from "firebase/firestore";
import { toast } from 'react-toastify';
const firebaseConfig = {
  apiKey: "AIzaSyClWOnMrXYgXUw1-qkVEikLwRYJiKe6GsQ",
  authDomain: "chat-app-gs-1248c.firebaseapp.com",
  projectId: "chat-app-gs-1248c",
  storageBucket: "chat-app-gs-1248c.firebasestorage.app",
  messagingSenderId: "889992793547",
  appId: "1:889992793547:web:4474018e6c2e4db1dafa4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const auth= getAuth(app);
const db =getFirestore(app);
const signup =async(username,email,password)=>{
    try{
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowercase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey,There i am using chat app",
            lastSeen:Date.now()
        } )
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        })

    } catch(error){

        console.error(error)

        toast.error(error.code.spilt('/')[1].spilt('-')).join(" ");
    }
    

}
 
const login = async(email,password)=>{
    try{
        await signInWithEmailAndPassword(auth,email,password);
    }catch(error){
        console.error(error);
        toast.error(error.code.spilt('/')[1].spilt('-')).join(" ");

    }
}

const logout = async()=>{
    try{
        await  signOut(auth)

    } catch(error){
        console.error(error);
        toast.error(error.code.spilt('/')[1].spilt('-')).join(" ");

    }

}
export {signup,login,logout,auth,db}