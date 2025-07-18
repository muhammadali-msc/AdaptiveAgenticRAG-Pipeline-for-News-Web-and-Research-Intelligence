import 'react'
import '../App.css'

import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { getAPI } from '../utils/APIClient'
import { useAuth } from './AuthContext';
import { Category, DisplayPost } from "./";
export const PostDetails = [
{text: "Post 1", author: "Ali"},
{text: "Post 1", author: "Ali"}
]
function DailyFeeds () {
  const { accessToken, tokenType } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Research");
  const [postDetails, setPostDetails] = useState([])

  useEffect(() => {
    setPostDetails([]);
    console.log("-------------------------------",accessToken,tokenType)
    getAPI(`user/${selectedCategory}/post`,accessToken,tokenType)
      .then((data) => setPostDetails(data))
    }, [selectedCategory]);

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      <Box sx={{ height: { sx: "auto", md: "92vh" }, borderRight: "1px solid #3d3d3d", px: { sx: 0, md: 2 } }}>
        <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        <Typography className="copyright" variant="body2" sx={{ mt: 1.5, color: "#fff", }}>
          Copyright © 2025
        </Typography>

      </Box>

      <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: 2 }}>
        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
          {selectedCategory} <span style={{ color: "#FC1503" }}>"Post"</span>
        </Typography>

        <DisplayPost PostDetails= {postDetails}/>
      </Box>

    </Stack>
  );
};

export default DailyFeeds;