const Profile = ({ id, size = 100, square, bgcolor }) => {
  const imagePath = `/profile/${id}.jpg`;
  
  return <img src={imagePath} alt={`Profile : ${id}`} style={{
            width: size,
            height: size,
            borderRadius: square ? '5px' : '50%', // 원형
            objectFit: 'cover',
            backgroundColor: bgcolor && '#F5F7FA',
            padding: bgcolor && '0.2rem',
          }}/>;
};

export default Profile;