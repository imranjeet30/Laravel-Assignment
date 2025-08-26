import { Routes, Route } from "react-router-dom";
import CreateUser from "./pages/CreateUser";
import Users from "./pages/Users";

import './index.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateUser />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}

