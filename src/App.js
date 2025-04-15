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

const App = () => { //라우터 설정
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/UserList" element={<UserList />} />
          <Route path="/HandDiary" element={<PrivateRoute><EnvProvider><HandDiary /></EnvProvider></PrivateRoute>} />
          <Route path="/AiDiary" element={<PrivateRoute><EnvProvider><AiDiary /></EnvProvider></PrivateRoute>} />
          <Route path="/ResultHanddiary" element={<PrivateRoute><EnvProvider><ResultHanddiary /></EnvProvider></PrivateRoute>} />
          <Route path="/ResultAidiary" element={<PrivateRoute><EnvProvider><ResultAidiary /></EnvProvider></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};


export default App;
