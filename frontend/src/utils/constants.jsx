import DynamicFeed from '@mui/icons-material/DynamicFeed';


export const categories = [
  { name: 'DailyFeeds', icon: <DynamicFeed />, },
  { name: 'Chuck Norris', icon: <DynamicFeed />, }

];


export const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const options = { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  const formattedDate = date.toLocaleDateString('en-US', options).replace(',', '') + ' ' .toLowerCase();
  return formattedDate;
};