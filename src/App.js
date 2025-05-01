import { Route, BrowserRouter, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import Test from "./Park/Test";
import Auth from "./Park/Auth";
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
import { DiaryProvider } from "./Lee/DiaryContext";
import CheckDiaryGuard from "./Lee/CheckDiaryGuard";
import Tail from "./Park/Tail";

const App = () => { //라우터 설정

  const Layout = ({ children }) => { //공통 레이아웃
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}> 
        <div style={{ padding: '1rem 25%', paddingTop: '6rem' }}>
          {children}
        </div>
      </div>
    );
  };

  const ProtectedPage = ({ children }) => { //로그인 필요 페이지 레이아웃
    return (
      <PrivateRoute>
        <DiaryProvider>
        <Header />
        <Layout>{children}</Layout>
        <Tail />
        </DiaryProvider>
      </PrivateRoute>
    );
  };

  const PublicPage = ({ children }) => { //로그인 불필요 페이지 레이아웃
    return (
      <DiaryProvider>
        <Header />
        <Layout>{children}</Layout>
        <Tail />
      </DiaryProvider>
    );
  };

  const MainLayout = ({ children }) => { //로그인 불필요 페이지 레이아웃
    return (
      <DiaryProvider>
        <Header />
          <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
          }}> 
          <div style={{ padding: '1rem 20%', paddingTop: '4rem' }}>
            {children}
          </div>
        </div>
        <Tail />
      </DiaryProvider>
    );
  };


  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
    <BrowserRouter>
      <Routes>
        {/* 로그인 불필요 컴포넌트 */}
        <Route path="/" element={<MainLayout><MainPage /></MainLayout>} />
        <Route path="/auth" element={<PublicPage><Auth /></PublicPage>} />
        <Route path="/register" element={<PublicPage><Register /></PublicPage>} />
        <Route path="/login" element={<PublicPage><Login /></PublicPage>} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/test" element={<Test />} />

        {/* 로그인 필수 컴포넌트 */}
        <Route path="/handdiary" element={<ProtectedPage><CheckDiaryGuard><HandDiary /></CheckDiaryGuard></ProtectedPage>} />
        <Route path="/aidiary" element={<ProtectedPage><CheckDiaryGuard><AiDiary /></CheckDiaryGuard></ProtectedPage>} />
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
              <DiaryProvider>
              <MypageList />
              </DiaryProvider>
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
    </div>
  );
};


export default App;
