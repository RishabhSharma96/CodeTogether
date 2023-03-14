import CodeScreen from "./Screens/CodeScreen";
import LoginScreen from "./Screens/LoginScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router >
      <Toaster position="top-right" />
      <div className="App">
        <Routes>

          <Route exact path="/" element={<LoginScreen />} />
          <Route exact path="/editor/:id" element={<CodeScreen />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
