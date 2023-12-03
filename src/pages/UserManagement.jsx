// UserManagement.js
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Input,
  Checkbox,
  Button,
  IconButton,
  TextField,
  FormControlLabel,
} from '@mui/material';


const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [users,setUsers] = useState([]);
  const [filteredUsers,setFilteredUsers] = useState([]);
  const itemsPerPage = 10;

  useEffect(()=>{
    const getData = async () => {
    try{
        const response = await fetch(`https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`,{
            method: 'GET'
        })
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
        const data = await response.json();
        const usersWithStringIds = data.map(user => ({
            ...user,
            id: String(user.id)
          }));
        setUsers(usersWithStringIds);
        setFilteredUsers(data);
    }
    catch(error){
        console.log(error);
    }
}
getData();
  },[])


  

  


  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSearchChange = (event) => {
    
      let newFilteredUsers = users.filter(
        (user) =>
          Object.values(user).some((value) =>
            value.toLowerCase().includes(searchTerm.toLowerCase())
           )
       );
       setFilteredUsers(newFilteredUsers)
      // setUsers(filteredUsers)
       setCurrentPage(1);
  };

  const updateSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleCheckboxChange = (event, userId) => {
    if (event.target.checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, userId]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== userId)
      );
    }
  };

  const handleSelectAllClick = () => {
    if (selectedRows.length === itemsPerPage) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(user => user.id));
    }
  };

  const handleEditClick = (userId) => {
    setEditableRow(userId);
  };

  const handleSaveClick = (userId) => {
    // Handle save logic here
    setEditableRow(null);
  };

  const handleDeleteSelectedClick = () => {
    // Handle delete logic here
    console.log(selectedRows);
    setFilteredUsers(filteredUsers.filter((user)=>{
        if(selectedRows.includes(user.id)){
            return false;
        }
        else{
            return true;
        }
    }))
    setSelectedRows([]);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <div>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={updateSearchTerm}
          sx={{
            ml:'20px'
          }}
        />
        <Button className="searchIcon" onClick={handleSearchChange}>
          Search
        </Button>
        <Button
        onClick={handleDeleteSelectedClick}
        className="delete-btn"
      >
        Delete Selected
      </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormControlLabel
                  control={
                    <Checkbox
                    sx={{
                        ml:'10px'
                    }}
                      checked={
                        selectedRows.length ===
                        filteredUsers.slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        ).length
                      }
                      onChange={handleSelectAllClick}
                    />
                  }
                  label=""
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(user.id)}
                      onChange={(event) =>
                        handleCheckboxChange(event, user.id)
                      }
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {editableRow === user.id ? (
                      <TextField value={user.name} onChange={(e)=>{
                       setFilteredUsers(filteredUsers.map((someUser)=>{
                            if(user.id===someUser.id){
                                console.log(someUser.name)
                                return {...someUser,name:e.target.value};
                            }
                            else{
                                return someUser
                            }
                        }))
                      }} />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editableRow === user.id ? (
                      <TextField value={user.email} onChange={(e)=>{
                        setFilteredUsers(filteredUsers.map((someUser)=>{
                             if(user.id===someUser.id){
                                 console.log(someUser.name)
                                 return {...someUser,email:e.target.value};
                             }
                             else{
                                 return someUser
                             }
                         }))
                       }} />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editableRow === user.id ? (
                      <TextField value={user.role} onChange={(e)=>{
                        setFilteredUsers(filteredUsers.map((someUser)=>{
                             if(user.id===someUser.id){
                                 console.log(someUser.name)
                                 return {...someUser,role:e.target.value};
                             }
                             else{
                                 return someUser
                             }
                         }))
                       }} />
                    ) : (
                      user.role
                    )}
                  </TableCell>
                  <TableCell>
                    {editableRow === user.id ? (
                      <IconButton
                        onClick={() => handleSaveClick(user.id)}
                      >
                        Save
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => handleEditClick(user.id)}
                      >
                        Edit
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div>
        <Button
          onClick={() => handlePageChange(1)}
          className="first-page"
        >
          First Page
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          className="previous-page"
          disabled={currentPage === 1}
        >
          Previous Page
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={index + 1 === currentPage ? 'current-page' : ''}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          className="next-page"
          disabled={currentPage === totalPages}
        >
          Next Page
        </Button>
        <Button
          onClick={() => handlePageChange(totalPages)}
          className="last-page"
        >
          Last Page
        </Button>
      </div>

    </div>
  );
};

export default UserManagement;
