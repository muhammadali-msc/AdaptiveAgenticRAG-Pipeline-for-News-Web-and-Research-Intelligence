import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

function SubscriptionDetails() {
  const subscriptionTypes = [
    {
      type: 'Freemium',
      description: 'Start your journey with our basic package.',
      details: [
        '50 credits per month to explore API endpoints',
        'Access to explore different humor categories',
        'Access to explore Post categories'
      ],
      action: 'Register for Freemium',
    },
    {
      type: 'Standard',
      description: 'Upgrade for more capabilities and flexibility.',
      details: [
        'Unlimited credits per month to explore API endpoints',
        'Access to explore different humor categories',
        'Access to explore post categories',
        'Ability to add new categories',
        'Ability to add posts based on specific categories'
      ],
      action: 'Register for Standard',
    },
    {
      type: 'Premium',
      description: 'Experience the full range of our platform\'s features.',
      details: [
        'Unlimited credits per month to explore API endpoints',
        'Access to explore different humor categories',
        'Access to explore post categories',
        'Ability to add new categories',
        'Ability to add posts based on specific categories',
        'Create new posts using the Cohere LLM Model'
      ],
      action: 'Register for Premium',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h4" align="center" style={{ color: '#FC1503' }} gutterBottom>
        AgenticAI Project Overview
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom style={{ color: 'white' }}>
          Overview
        </Typography>
        <Typography variant="body1" gutterBottom style={{ color: 'white' }}>
          AgenticAI is an interactive web application designed to bring daily humor to its users through a curated selection of post. With a robust backend built on FASTAPI and a dynamic frontend powered by React, DailyFeeds offers a seamless and engaging user experience.
        </Typography>
        <Typography variant="body1" gutterBottom style={{ color: 'white' }}>
          <strong>Backend: FASTAPI</strong><br />
          FASTAPI is a high-performance web framework used to build the backend of DailyFeed. Leveraging the power of Python 3.11+ and its asynchronous capabilities, FASTAPI ensures rapid API development without compromising on performance.
        </Typography>
        <Typography variant="body1" gutterBottom style={{ color: 'white' }}>
          <strong>Key Features</strong><br />
          <ul>
            <li>Daily Retrieval: Fetch daily posts based on selected categories to entertain users with a diverse range of humor.</li>
            <li>Category Management: Allow administrators to add and manage post categories, expanding the platform's content offerings.</li>
            <li>User Authentication: Implement secure user registration and login functionalities to safeguard user data and personalize user experiences.</li>
            <li>Cohere LLM Model Integration: Utilize LLM capabilities to generate humorous stories, enhancing the platform's content diversity.</li>
          </ul>
          <strong>Frontend: React</strong><br />
          React powers the DailyFeed frontend, providing users with a responsive and interactive interface. Through React's component-based architecture, DailyFeed delivers a seamless browsing experience with real-time updates and intuitive user interactions.
        </Typography>
        <Typography variant="body1" gutterBottom style={{ color: 'white' }}>
          <strong>Subscription Levels</strong><br />
          Users can choose from three subscription tiers, each offering unique benefits tailored to different user preferences:<br />
          <ul>
            <li>Freemium: <span style={{ color: 'black' }}>A free tier allowing users to explore basic features with limited credits.</span></li>
            <li>Standard: <span style={{ color: 'black' }}>A mid-tier subscription providing unlimited access to Posts, category management, and additional features.</span></li>
            <li>Premium: <span style={{ color: 'black' }}>The highest tier offering all-inclusive access to the platform's features, including Cohere LLM model-generated stories.</span></li>
          </ul>
        </Typography>
        <Typography variant="body1" gutterBottom style={{ color: 'white' }}>
          <strong>Conclusion</strong><br />
          DailyFeed aims to brighten users' days with laughter while offering a rich and interactive platform for post enthusiasts. Whether you're looking to enjoy a quick laugh or dive deep into a treasure trove of humor, DailyFeed has something for everyone, backed by a powerful backend and an intuitive frontend to deliver an unparalleled user experience.
        </Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        {subscriptionTypes.map((subscription, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div" align="center" style={{ color: '#FC1503' }} sx={{ mb: 1 }}>
                  {subscription.type}
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary">
                  {subscription.description}
                </Typography>
                <List>
                  {subscription.details.map((detail, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemText primary={`• ${detail}`} primaryTypographyProps={{ style: { color: 'black' } }} />
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <Button
                  component={Link}
                  to={`/register?subscription=${subscription.type}`}
                  variant="contained"
                  fullWidth
                  style={{ backgroundColor: '#FC1503', color: 'white', textTransform: 'none' }}
                  sx={{ '&:hover': { backgroundColor: '#D10C00' } }}
                >
                  {subscription.action}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SubscriptionDetails;