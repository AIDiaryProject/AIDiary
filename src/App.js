import { Route, BrowserRouter, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import Test from "./Park/Test";
import Register from "./Park/Register";
import UserList from "./Park/UserList";
import Login from "./Park/Login";
import AiDiary from "./Lee/AiDiary";
import HandDiary from "./Lee/Handdiary";
import ResultAiDiary from "./Lee/ResultAidiary";
import ResultHandDiary from "./Lee/ResultHanddiary";
import { EnvProvider } from "./Lee/EnvContext";

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
          <Route path="/handdiary" element={<EnvProvider><HandDiary /></EnvProvider>} />
          <Route path="/aidiary" element={<EnvProvider><AiDiary /></EnvProvider>} />
          <Route path="/resulthanddiary" element={<EnvProvider><ResultHandDiary /></EnvProvider>} />
          <Route path="/resultaidiary" element={<EnvProvider><ResultAiDiary /></EnvProvider>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};


export default App;
