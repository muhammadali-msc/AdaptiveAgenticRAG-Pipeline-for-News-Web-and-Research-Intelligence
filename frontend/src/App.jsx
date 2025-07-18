import 'react'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from '@mui/material';

import {Navbar, DailyFeeds, Login, Register,AddCategory, AddNewPost, AddAgenticAI, Overview, ProfileSetting} from './components'
function App() {
  return (
     <BrowserRouter>
    <Box sx={{ backgroundColor: '#000' }}>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<DailyFeeds />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Register" element={<Register/>} />
        <Route path="/AddCategory" element={<AddCategory/>} />
        <Route path="/AddNewPost" element={<AddNewPost/>} />
        <Route path="/AddAgenticAI" element={<AddAgenticAI/>} />
        <Route path="/Overview" element={<Overview/>} />
        <Route path="/ProfileSetting" element={<ProfileSetting/>} />
      </Routes>
    </Box>
  </BrowserRouter>
  )
}

export default App
