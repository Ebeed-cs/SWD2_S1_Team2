import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import React, { useContext, useEffect } from 'react'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import { Routes, Route ,useNavigate} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import'react-toastify/dist/ReactToastify.css';
import{onAuthStateChanged} from'firebase/auth'
import { auth } from './config/firebase'
import { AppContext } from './context/AppContext'
import'react-toastify/dist/ReactToastify.css';

const App = () => {
  const navigate = useNavigate();
const{loadUserData} = useContext(AppContext)

  useEffect(()=>{
    onAuthStateChanged(auth,async(user)=> {
      if (user){

        navigate('/chat')
        await loadUserData(user.uid)


      }
      else{
        navigate('/')

      }

    })
  },[])
  return (
    <>
        <ToastContainer/>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile' element={<ProfileUpdate />} />
      </Routes>
    </>
  )
}

export default App
