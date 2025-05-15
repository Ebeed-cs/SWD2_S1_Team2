import React, { useContext, useEffect, useState } from 'react'
import './LeftSideBar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { collection, query, where , getDocs, serverTimestamp, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { doc, setDoc } from 'firebase/firestore';
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify';
const LeftSideBar = () => {
    const navigate = useNavigate();
    const {userData , chatData , chatUser , setChatUser , setMessagesId , messagesId , chatVisible , setChatVisible} = useContext(AppContext);
    const [user,setUser] = useState(null);
    const [showSearch , SetShowSearch] = useState(false);

    const inputHandler = async (e) => {
        try{
            const input = e.target.value;
            if(input){
                SetShowSearch(true);
                const userRef = collection(db , 'users');
                const q = query(userRef , where("username" , "==" , input.toLowerCase()));
                const querySnap = await getDocs(q);
                if(!querySnap.empty && querySnap.docs[0].data().id !== userData.id){
                    let userExitst = false
                    chatData.map((user) => {
                        if(user.rId === querySnap.docs[0].data().id){
                            userExitst = true;
                        }
                    })
                    if(!userExitst){
                        setUser(querySnap.docs[0].data());
                    }
            }
                else{
                    setUser(null);
                }
            }
            else{
                SetShowSearch(false);
            }
        }catch(error) {
    console.error("Search error:", error);
}

    }

    const addChat = async() => {
        const messagesRef = collection(db , "messages");
        const chatsRef = collection(db , "chats");
        try{
            const newMessageRef = doc(messagesRef);
            await setDoc(newMessageRef , {
                createAt: serverTimestamp(),
                messages:[]
            })

            await updateDoc(doc(chatsRef , user.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage:"",
                    rId:userData.id,
                    updatedAt:Date.now(),
                    messageSeen:true
                })
            })

            await updateDoc(doc(chatsRef , userData.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage:"",
                    rId:user.id,
                    updatedAt:Date.now(),
                    messageSeen:true
                })
            })

            const uSnap = await getDoc(doc(db , "users" , user.id));
            const uData = uSnap.data();
            setChat({
                messagesId: newMessageRef.id,
                lastMessage: "",
                rId: user.id,
                updatedAt: Date.now(),
                messageSeen: true,
                userData: uData
            })
            SetShowSearch(false)
            setChatVisible(true)
        }catch (error) {
            toast.error(error);
}

    }

        useEffect(() => {
            const updateChatUserData = async () => {
                if(chatUser){
                    const userRef = doc(db , "users" , chatUser.userData.id);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    setChatUser(prev => ({...prev,userData:userData}))
                }
            }
            updateChatUserData();
        } , [chatData])

    const setChat = async (item) =>{
        try{
            setMessagesId(item.messageId);
            setChatUser(item);  
            const userChatsRef = doc(db , 'chats' , userData.id);
            const userChatsSnapshot = await getDoc(userChatsRef);
            const userChatsData = userChatsSnapshot.data();
            const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId);
            userChatsData.chatsData[chatIndex].messageSeen = true;
            await updateDoc(userChatsRef , {
                chatsData: userChatsData.chatsData
            })      
            setChatVisible(true);
        }catch(error){
            toast.error(error.message);
        }
    }

    return (
        <div className={`ls ${chatVisible? "hidden" : ""}`}>
            <div className="ls-top">
                <div className="ls-nav">
                    <img src={assets.logo} className='logo' />
                    <div className="menu">
                        <img src={assets.menu_icon} alt="three dots icon" />
                        <div className="sub-menu">
                            <p onClick={() => navigate('/profile')}>Edit Profile</p>
                            <hr />
                            <p>Logout</p>
                        </div>
                    </div>
                </div>
                <div className="ls-search">
                    <img src={assets.search_icon} alt="" />
                    <input onChange={inputHandler} type="text" placeholder='Search here...' />
                </div>
            </div>
            <div className="ls-list">
                {showSearch && user ? (
                    <div onClick={addChat} className='friends add-user'>
                    <img src={user.avatar} alt="" />
                    <p>{user.name}</p>
                    </div>
                ) :  (
                    chatData?.length > 0 ? (
                    chatData.map((item, index) => (
                        <div onClick={() => setChat(item)} key={index} className={`friends ${item.messageSeen || item.messageId === messagesId? "" : "border"}`}>
                        <img src={item?.userData?.avatar || assets.profile_img} alt="user" />
                        <div>
                            <p>{item?.userData?.name || "Unnamed User"}</p>
                            <span>{item?.lastMessage || "No messages yet"}</span>
                        </div>
                        </div>
                    ))
                    ) : (
                    <p style={{ padding: '1rem', color: 'gray' }}>No chats found.</p>
                    )
                )}
                </div>
        </div>
    )
}

export default LeftSideBar
