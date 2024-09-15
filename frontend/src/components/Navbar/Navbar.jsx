import React, { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import Searchbar from '../SearchBar/Searchbar';

function Navbar({ userInfo, onSearchNote, handleClearSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Ensure this is inside the functional component

  const onLogout = () => {
    localStorage.clear();
    navigate('/login'); // Proper navigation after clearing local storage
  };

  const handleSearch = () => {
    if (searchQuery){
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery('');
    handleClearSearch();
  };

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      {/* Wrap "NoteSphere" with Link to make it clickable */}
      <Link to="/dashboard">
        <h2 className='text-xl font-medium text-black py-2 cursor-pointer hover:text-blue-600'>
          NoteSphere
        </h2>
      </Link>
     
      <Searchbar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
}

export default Navbar;
