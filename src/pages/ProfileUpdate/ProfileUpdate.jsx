import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileUpdate.css';
import assets from '../../assets/assets';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

// Cloudinary upload function
const uploadToCloudinary = async (file) => {
    const cloudName = 'dl7nqgetm'; // your cloud name
    const unsignedPreset = 'public_upload'; // your upload preset

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', unsignedPreset);

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error('Cloudinary upload failed');

    const data = await response.json();
    return data.secure_url; // this is the image URL
};

const ProfileUpdate = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [uid, setUid] = useState("");
    const [prevImage, setPrevImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { setUserData } = useContext(AppContext);

    const profileUpdate = async (event) => {
        event.preventDefault();

        if (!uid) {
            toast.error("User not authenticated");
            return;
        }

        try {
            setIsLoading(true);
            const userRef = doc(db, "users", uid);

            const updateData = {
                name: name,
                bio: bio,
                avatar: prevImage || ""
            };

            if (image) {
                try {
                    const downloadURL = await uploadToCloudinary(image);
                    updateData.avatar = downloadURL;
                    setPrevImage(downloadURL);
                } catch (uploadError) {
                    console.error("Cloudinary upload error:", uploadError);
                    toast.error("Image upload failed. Profile updated without new image.");
                }
            }

            await updateDoc(userRef, updateData);
            const snap = await getDoc(userRef);
            setUserData(snap.data());
            toast.success("Profile updated successfully!");
            navigate('/chat');

        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        if (userData.name) setName(userData.name);
                        if (userData.bio) setBio(userData.bio);
                        if (userData.avatar) setPrevImage(userData.avatar);
                    }
                } catch (error) {
                    console.error("Error loading user data:", error);
                    toast.error("Failed to load profile data");
                }
            } else {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className='profile'>
            <div className="profile-container">
                <form onSubmit={profileUpdate}>
                    <h3>Profile Details</h3>
                    <label htmlFor="avatar">
                        <input 
                            onChange={(e) => setImage(e.target.files[0])} 
                            type="file" 
                            id='avatar' 
                            accept='.png, .jpg, .jpeg' 
                            hidden 
                        />
                        <img 
                            src={image ? URL.createObjectURL(image) : (prevImage || assets.avatar_icon)} 
                            alt="" 
                        />
                        upload profile image 
                    </label>
                    <input 
                        onChange={(e) => setName(e.target.value)} 
                        value={name} 
                        type="text" 
                        placeholder='Your name' 
                        required
                    />
                    <textarea 
                        onChange={(e) => setBio(e.target.value)}
                        value={bio} 
                        placeholder='Write profile bio' 
                        required
                    ></textarea>
                    <button type='submit' disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </form>
                <img 
                    className='profile-pic' 
                    src={image ? URL.createObjectURL(image) : (prevImage || assets.logo_icon)} 
                    alt="" 
                />
            </div>
        </div>
    );
};

export default ProfileUpdate;
