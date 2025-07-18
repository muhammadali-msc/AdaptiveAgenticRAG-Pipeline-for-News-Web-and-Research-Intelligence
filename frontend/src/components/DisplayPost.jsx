import { Card, CardContent, Stack, Typography, Avatar, Box } from '@mui/material';
import { formatDate } from '../utils/constants';
import ReactMarkdown from 'react-markdown';

function DisplayPost({ PostDetails }) {
  return (
    <Stack
      spacing={2}
      direction="column"
      alignItems="center"
      sx={{
        overflowY: "auto",
        height: { sx: "auto", md: "95%" },
      }}
    >
      {PostDetails.map((PostDetails, index) => (
        <Card key={index} sx={{ width: '100%', boxShadow: 1, my: 2 }}>
          <Box sx={{ overflow: 'auto' }}> {/* Wrapper Box */}
            <CardContent sx={{ height: 'auto', '&:last-child': { pb: 2 } }}>
              <Stack direction="column" alignItems="flex-start" spacing={1}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar alt={PostDetails.author_name} src={PostDetails.author_avatar} />
                  <Stack>
                    <Typography variant="subtitle1">
                      {PostDetails.author_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(PostDetails.created_at)}
                    </Typography>
                  </Stack>
                </Stack>
                <ReactMarkdown>
                  {PostDetails.text}
                </ReactMarkdown>
              </Stack>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Stack>
  );
}

export default DisplayPost;