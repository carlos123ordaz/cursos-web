import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Box } from '@mui/material';
import { useAuth } from '../contexts/Authcontext';

const UserLayout = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} />
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default UserLayout;