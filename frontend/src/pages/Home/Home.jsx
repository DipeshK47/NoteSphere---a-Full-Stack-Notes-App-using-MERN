import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { NoteCard } from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance.js';
import Toast from '../../components/ToastMessage/Toast.jsx';
import AddNotesImg from '../../assets/images/add-notes.svg';
import EmptyCard from '../../components/EmptyCard/EmptyCard.jsx';
import NoDataImg from '../../assets/images/no-data.svg';
import { motion } from 'framer-motion'; // Import motion

// Set the app element for accessibility
Modal.setAppElement('#root');

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "success",  // Default to "success" for the toast
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const [isSearch, setIsSearch] = useState(false);

  // Search for a note
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", { // Ensure backend has '/search-notes' endpoint
        params: { query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      } else {
        // If no notes found, reset the search state
        setIsSearch(true);
        setAllNotes([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: 'edit' });
  };

  const showToastMessage = (message, type = "success") => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });

    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      setShowToastMsg((prev) => ({
        ...prev,
        isShown: false,
        message: "",
      }));
    }, 3000); // 3 seconds
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
      type: "success", // Reset to default type
    });
  };

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) { // Added check for error.response
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes');
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An error occurred", error);
    }
  };

  // Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id;

    console.log("Attempting to delete note with ID:", noteId); // Add log

    try {
      const response = await axiosInstance.delete('/delete-note/' + noteId);

      console.log("Delete response:", response); // Log the response

      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", 'delete');  // Changed 'success' to 'delete'

        // Filter out the deleted note from the state
        setAllNotes((prevNotes) => {
          const updatedNotes = prevNotes.filter((note) => note._id !== noteId);
          console.log("Updated notes after deletion:", updatedNotes); // Log updated notes
          return updatedNotes;  // Return the new state
        });
      } else {
        console.log("Error in delete response data:", response.data);
      }
    } catch (error) {
      console.error("An error occurred while deleting the note:", error);
    }
  };

  // Pin Note
  const updateIsPinned = async (note) => { // Renamed 'query' to 'note' for clarity
    const noteId = note._id;
    try {
      const response = await axiosInstance.put('/update-note-pinned/' + noteId, {
        isPinned: !note.isPinned, // Changed 'noteId.isPinned' to 'note.isPinned'
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Pinned Successfully", 'success'); // Type 'success' is appropriate here
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  // Function to close the modal
  const closeModal = () => {
    setOpenAddEditModal({
      isShown: false,
      type: "add",
      data: null,
    });
  };

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} />
      <div className='container mx-auto'>
        {allNotes.length > 0 ? (
          <motion.div
            className='grid grid-cols-3 gap-4 mt-8'
            layout // Enables layout animations
          >
            {allNotes.map((item) => (
              <motion.div
                key={item._id}
                layout // Enables layout animations for each note
              >
                <NoteCard
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => updateIsPinned(item)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddNotesImg}
            message={
              isSearch
                ? "Oops! No Notes found matching your search" // Corrected typos
                : "Start Creating your first Note! Click the '+' button to start creating. Let's get Started!!"
            }
          />
        )}
      </div>

      <button
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
        aria-label="Add Note" // Added aria-label for accessibility
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={closeModal} // Closes modal when clicking outside or pressing ESC
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel="Add/Edit Note"
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes 
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      {/* Toast component to display notifications */}
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;