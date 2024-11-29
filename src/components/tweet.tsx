// src/pages/index.tsx
// import Feed from '../components/Feed';

const HomePage = () => {
  const tweets = [
    { id: 1, user: 'X Developers', content: 'Build what\'s next with our API', likes: 25 },
    { id: 2, user: 'RED Global', content: 'Women in Tech: Breaking barriers to blockchain adoption.', likes: 15 },
  ];

  return (
    <div>
      {/* <Feed tweets={tweets} /> */}
    </div>
  );
};

export default HomePage;
