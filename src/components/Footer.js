import React from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  InputBase,
  Button,
  styled,
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import bgMaps from '../assets/bgmaps.png';

const FooterWrapper = styled(Box)({
  width: '100%',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  backgroundImage: `url(${bgMaps})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundBlendMode: 'overlay',
});

const SearchPaper = styled(Paper)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: '600px',
  padding: '2px 4px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderRadius: '4px',
  backgroundColor: 'white',
});

const SearchButton = styled(Button)({
  color: '#0096CC',
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 'normal',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#007AAD',
  },
});

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <FooterWrapper component="footer">
      <SearchPaper component="form" onSubmit={handleSubmit}>
        <IconButton sx={{ p: '10px', color: '#666' }}>
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Find your branch..."
          inputProps={{ 'aria-label': 'search branches' }}
        />
        <SearchButton>Search</SearchButton>
      </SearchPaper>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: '14px' }}
      >
        © 2024 Personal Finance Assistant
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <IconButton
          aria-label="Facebook"
          href="https://facebook.com"
          target="_blank"
          sx={{ color: '#666' }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          aria-label="Twitter"
          href="https://twitter.com"
          target="_blank"
          sx={{ color: '#666' }}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          aria-label="Instagram"
          href="https://instagram.com"
          target="_blank"
          sx={{ color: '#666' }}
        >
          <InstagramIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, color: '#666', fontSize: '14px' }}>
        <Link href="/privacy" color="inherit" underline="hover">
          Privacy Policy
        </Link>
        <Typography color="inherit">|</Typography>
        <Link href="/terms" color="inherit" underline="hover">
          Terms of Service
        </Link>
        <Typography color="inherit">|</Typography>
        <Link href="/cookies" color="inherit" underline="hover">
          Cookie Policy
        </Link>
      </Box>
    </FooterWrapper>
  );
};

export default Footer;
