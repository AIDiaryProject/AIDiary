import { Route, BrowserRouter, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import Test from "./Park/Test";
import Register from "./Park/Register";
import UserList from "./Park/UserList";
import Login from "./Park/Login";

const App = () => { //라우터 설정
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/handdiary" element={<Test />} />
          <Route path="/aidiary" element={<p>ai일기페이지</p>} />
          <Route path="/Register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/UserList" element={<UserList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};


export default App;
