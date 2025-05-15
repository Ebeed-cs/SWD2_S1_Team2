import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from'../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'
const ChatBox = () => {
    const {userData , messagesId , chatUser , messages , setMessages , chatVisible , setChatVisible} = useContext(AppContext);
    const[input,setInput] = useState("");

    const sendMessage = async () => {
        try{
            if(input && messagesId){
                await updateDoc(doc(db , 'messages' , messagesId),{
                    messages: arrayUnion({
                        sId: userData.id,
                        text: input,
                        createdAt: new Date()
                    })
                })
                const userIDs = [chatUser.rId , userData.id];

                userIDs.forEach(async (id) => {
                    const userChatsRef = doc(db , 'chats' , id);
                    const userChatsSnapshot = await getDoc(userChatsRef);

                    if(userChatsSnapshot.exists()){
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatsData.findIndex((c)=>c.messageId === messagesId);
                        userChatData.chatsData[chatIndex].lastMessage = input.slice(0 , 30);
                        userChatData.chatsData[chatIndex].updatedAt = Date.now();
                        if(userChatData.chatsData[chatIndex].rId === userData.id){
                            userChatData.chatsData[chatIndex].messageSeen = false;
                        }
                        await updateDoc(userChatsRef,{
                            chatsData: userChatData.chatsData
                        })
                    }
                })
            }
        }catch(error){
            toast.error(error.message);
        }
        setInput("");
    }

const uploadToCloudinary = async (file) => {
    const cloudName = 'dl7nqgetm';
    const unsignedPreset = 'public_upload'; 

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
    return data.secure_url; 
};


    const sendImage = async (e) => {
    try {
       
        const fileUrl = await uploadToCloudinary(e.target.files[0]);
        
        if(fileUrl && messagesId){
            await updateDoc(doc(db, 'messages', messagesId), {
                messages: arrayUnion({
                    sId: userData.id,
                    image: fileUrl,
                    createdAt: new Date()
                })
            });
            
            const userIDs = [chatUser.rId, userData.id];

            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, 'chats', id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if(userChatsSnapshot.exists()){
                    const userChatData = userChatsSnapshot.data();
                    const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
                    userChatData.chatsData[chatIndex].lastMessage = "Image";
                    userChatData.chatsData[chatIndex].updatedAt = Date.now();
                    if(userChatData.chatsData[chatIndex].rId === userData.id){
                        userChatData.chatsData[chatIndex].messageSeen = false;
                    }
                    await updateDoc(userChatsRef, {
                        chatsData: userChatData.chatsData
                    });
                }
            });
        }
    } catch(error) {
        toast.error("Failed to upload image: " + error.message);
    } 
};

    const convertTimestamp = (timestamp) => {
        let Date = timestamp.toDate();
        const hour = Date.getHours();
        const minute = Date.getMinutes();
        if(hour > 12){
            return hour - 12 + ":" + minute + "PM";
        }else{
            return hour+ ":" + minute + "AM";
        }
    }

    useEffect(() => {
        if(messagesId){
            const unSub = onSnapshot(doc(db, 'messages', messagesId),(res)=>{
                setMessages(res.data().messages.reverse());
            })
            return () => {
                unSub();
            }
        }
    } , [messagesId])

    return chatUser? (
        <div className={`chat-box ${chatVisible? "": "hidden"}`}>
         <div className="chat-user">
            <img src= {chatUser.userData.avatar} alt="" />
            <p>
            {Date.now() - chatUser.userData.lastSeen <= 7000 ? (
                <img src={assets.green_dot} className='dot' alt="" />
            ) : null}
            {chatUser.userData.name}
            </p>
            <img src={assets.help_icon} className='help' alt="help icon" />
            <img src={assets.arrow_icon} onClick={()=>{setChatVisible(false)}} alt="" className='arrow' />
         </div>


         <div className="chat-msg"> 
           
           {messages.map((msg , index) => (
                <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
                    {msg["image"]?
                    <img className='msg-img' src={msg.image} alt=''/>
                    :
                    <p className="msg">{msg.text}</p>
                }
                <div>
                    <img src={msg.sId === userData.id? userData.avatar : chatUser.userData.avatar} alt="" />
                    <p>{convertTimestamp(msg.createdAt)}</p>
                </div>
                </div>
           ))}
            
         </div>






         <div className="chat-input">
            <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder="Send a message" />
            <input onChange={sendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
            <label htmlFor="image">
                <img src={assets.gallery_icon} alt="insert image icon" />
            </label>
            <img onClick={sendMessage} src={assets.send_button} alt="telegram icon" />
         </div>

        </div>
    ) :
    <div className={`chat-welcome ${chatVisible? "": "hidden"}`}>
        <img src={assets.logo_icon} alt="" />
        <p>Chat anythim , anywhere</p>
    </div>
}

export default ChatBox
