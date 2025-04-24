const Profile = ({ id, size = 100, square }) => {
  const imagePath = `/profile/${id}.jpg`;
  
  return <img src={imagePath} alt={`Profile : ${id}`} style={{
            width: size,
            height: size,
            borderRadius: square ? '5px' : '50%', // 원형
            objectFit: 'cover',
          }}/>;
};

export default Profile;