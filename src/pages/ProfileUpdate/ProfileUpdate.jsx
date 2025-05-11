import React, { use, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../config/firebase';
import { doc, getDoc } from "firebase/firestore";
const ProfileUpdate = () => {
    const navigate = useNavigate();
    const [image,setImage] = useState(false);
    const[name,setName] = useState("");
    const [bio,setBio] = useState("");
    const [uid,setUid] = useState("");
    const[prevImag, setPrevImage] = useState("");
    const profileUpdate = async (event) =>{
        event.preventDefault();
        

    }
    useEffect(()=>{
        onAuthStateChanged(auth , async(user)=>{
            if (user){
                setUid(user.uid)
                const docRef = doc (db,"users",user.uid);
                const docSnap =await getDoc(docRef);
                if(docSnap.data().name){
                    setName(docSnap.data().name);
                }
                if(docSnap.data().name){
                    setBio(Snap.data().bio);
                }
                if(docSnap.data().avatar){
                    setPrevImage(docSnap.data().avatar)
                }



            }
            else{
                navigate('/')

            }
        })

    },[])
    return (
        <div className='profile'>
            <div className="profile-container">
                <form onSubmit={profileUpdate}>
                    <h3>Profile Details</h3>
                    <label htmlFor="avatar">
                        <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='avatar' accept='.png , .jpg , .jpeg' hidden />
                        <img src={image? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
                        upload profile image 
                    </label>
                    <input on onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Your name' required/>
                    <textarea onChange={(e)=> setBio(e.target.bio)}value={bio} placeholder='Write profile bio' required></textarea>
                    <button type='submit'>save</button>
                </form>
                <img className='profile-pic' src={ image? URL.createObjectURL(image) :assets.logo_icon} alt="" />
            </div>
        </div>
    )
}

export default ProfileUpdate
