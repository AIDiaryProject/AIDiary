import { Route, BrowserRouter, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import Test from "./Park/Test";
import Register from "./Park/Register";
import UserList from "./Park/UserList";
import Login from "./Park/Login";
import AiDiary from "./Lee/AiDiary";
import HandDiary from "./Lee/HandDiary";
import ResultAidiary from "./Lee/ResultAidiary";
import ResultHanddiary from "./Lee/ResultHanddiary";
import { EnvProvider } from "./Lee/EnvContext";
import PrivateRoute from "./PrivateRoute";
import MypageInfo from "./Park/MypageInfo";
import MypageList from "./Lee/MypageList";
import Header from "./Park/Header";
import StatsData from "./Lee/StatsData";
import PointShop from "./Park/PointShop";
import MypageSideMenu from "./Park/MypageSideMenu";

const App = () => { //라우터 설정

  const Layout = ({ children }) => { //공통 레이아웃
    return (
      <div style={{ padding: '1rem 25%', backgroundColor:'#F5F7FA' }}>
        {children}
      </div>
    );
  };

  const ProtectedPage = ({ children }) => { //로그인 필요 페이지 레이아웃
    return (
      <PrivateRoute>
        <Header />
        <Layout>{children}</Layout>
      </PrivateRoute>
    );
  };

  const PublicPage = ({ children }) => { //로그인 불필요 페이지 레이아웃
    return (
      <>
        <Header />
        <Layout>{children}</Layout>
      </>
    );
  };


  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 불필요 컴포넌트 */}
        <Route path="/" element={<PublicPage><MainPage /></PublicPage>} />
        <Route path="/register" element={<PublicPage><Register /></PublicPage>} />
        <Route path="/login" element={<PublicPage><Login /></PublicPage>} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/test" element={<Test />} />

        {/* 로그인 필수 컴포넌트 */}
        <Route path="/handdiary" element={<ProtectedPage><HandDiary /></ProtectedPage>} />
        <Route path="/aidiary" element={<ProtectedPage><AiDiary /></ProtectedPage>} />
        <Route path="/resulthanddiary" element={<ProtectedPage><EnvProvider><ResultHanddiary /></EnvProvider></ProtectedPage>} />
        <Route path="/resultaidiary" element={<ProtectedPage><EnvProvider><ResultAidiary /></EnvProvider></ProtectedPage>} />

        {/* 마이페이지 */}
        <Route path="/mypageinfo" element={
          <ProtectedPage>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <MypageSideMenu />
              <MypageInfo />
            </div>
          </ProtectedPage>
        } />

        <Route path="/mypagelist" element={
          <ProtectedPage>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <MypageSideMenu />
              <EnvProvider>
              <MypageList />
              </EnvProvider>
            </div>
          </ProtectedPage>
        } />

        <Route path="/statsdata" element={
          <ProtectedPage>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <MypageSideMenu />
              <StatsData />
            </div>
          </ProtectedPage>
        } />

        <Route path="/pointshop" element={
          <ProtectedPage>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <MypageSideMenu />
              <PointShop />
            </div>
          </ProtectedPage>
        } />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
