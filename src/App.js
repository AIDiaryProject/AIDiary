import { Route, BrowserRouter, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import Test from "./Park/Test";

const App = () => { //라우터 설정
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/handdiary" element={<Test />} />
          <Route path="/aidiary" element={<p>ai일기페이지</p>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
