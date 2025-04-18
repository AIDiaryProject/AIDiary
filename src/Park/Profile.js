const Profile = ({ id, size = 100 }) => {
  // const imagePath = `/images/profiles/${id}.png`; // 프로필 이미지 경로 (예시)
  const imagePath = `/profile/${id}.jpg`;
  return <img src={imagePath} width={size} height={size} alt={`Profile : ${id}`} style={{
            width: size,
            height: size,
            borderRadius: '50%', // 원형
            objectFit: 'cover',
          }}/>;
};

export default Profile;