import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileArea from "./components/fileArea";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
import LoginPage from "./components/loginPage";
import RegisterAdmin from "./components/registerSection";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterAdmin />} />
          <Route path="/filearea/*" element={<FileArea />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
