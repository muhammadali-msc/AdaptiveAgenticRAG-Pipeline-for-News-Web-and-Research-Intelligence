import 'react'
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import DynamicFeed from '@mui/icons-material/DynamicFeed';
import { useAuth } from './AuthContext';

import { getAPI } from '../utils/APIClient'
function Category({ selectedCategory, setSelectedCategory }) {
  const { accessToken, tokenType } = useAuth();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    setCategories([])
    getAPI("user/getCategory",accessToken, tokenType)
      .then((data) => setCategories(data))
    }, [selectedCategory]);
return (
  <Stack
    direction="row"
    sx={{
      overflowY: "auto",
      height: { sx: "auto", md: "95%" },
      flexDirection: { md: "column" },
    }}
    >
    {categories.map((category) => (
      <button
        className="category-btn"
        onClick={() => setSelectedCategory(category.category_name)}
        style={{
          background: category.category_name === selectedCategory && "#FC1503",
          color: "white",
        }}
        key={category.category_name}
      >
        <span style={{ color: category.category_name === selectedCategory ? "white" : "red", marginRight: "15px" }}>
          {<DynamicFeed />}
        </span>
        <span style={{ opacity: category.category_name === selectedCategory ? "1" : "0.8" }}>
          {category.category_name}
        </span>
      </button>
    ))}
  </Stack>
  )
};

export default Category;