import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('https://aidiary.onrender.com/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h2>회원 목록</h2>
      <ul>
        {users.map((user) => (
          <p>{user.id} {user.password} {user.nickname} {user.profile}</p>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
