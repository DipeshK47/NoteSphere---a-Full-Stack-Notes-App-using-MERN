import React from 'react';
import { getInitials } from '../../utils/helper';

const ProfileInfo = ({ userInfo, onLogout }) => {
  // If userInfo is null or undefined, provide default values
  if (!userInfo) {
    return null; // Or show a loading spinner, placeholder, etc.
  }

  return (
    <div className='flex items-center gap-3'>
      <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
        {getInitials(userInfo.fullName || '')} {/* Safely accessing fullName */}
      </div>

      <div>
        <p className='text-sm font-medium'>{userInfo.fullName || 'Guest'}</p> {/* Fallback to 'Guest' */}
        <button className='text-sm text-blue-500 hover:underline' onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;