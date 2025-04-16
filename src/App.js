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

const App = () => { //라우터 설정
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Header /><MainPage /></>} />
          <Route path="/test" element={<Test />} />
          <Route path="/Register" element={<><Header /><Register /></>} />
          <Route path="/login" element={<><Header /><Login /></>} />
          <Route path="/UserList" element={<UserList />} />
          <Route path="/HandDiary" element={<PrivateRoute><Header /><HandDiary /></PrivateRoute>} />
          <Route path="/AiDiary" element={<PrivateRoute><Header /><AiDiary /></PrivateRoute>} />
          <Route path="/ResultHanddiary" element={<PrivateRoute><Header /><EnvProvider><ResultHanddiary /></EnvProvider></PrivateRoute>} />
          <Route path="/ResultAidiary" element={<PrivateRoute><Header /><EnvProvider><ResultAidiary /></EnvProvider></PrivateRoute>} />
          <Route path="/Mypageinfo" element={<><Header /><MypageInfo /></>} />
          <Route path="/Mypagelist" element={<PrivateRoute><Header /><MypageList /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};


export default App;
