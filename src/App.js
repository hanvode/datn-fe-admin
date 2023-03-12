import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthenContext";
import { hotelColumns, foodColumns, userColumns, reviewColumns } from "./datatablesource";
import NewHotel from "./pages/newHotel/NewHotel";
import Edit from "./pages/edit/Edit";
import SingleHotel from "./pages/singleDiner/SingleHotel";
import EditHotel from "./pages/editHotel/EditHotel";
import SingleFood from "./pages/single/SingleFood";
import NewFood from "./pages/newFood/NewFood";
import EditFood from "./pages/editFood/EditFood";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="user">
              <Route
                index
                element= {
                  <ProtectedRoute>
                    <List columns={userColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":userId"
                element={
                  <ProtectedRoute>
                    <Single />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <New inputs={userInputs} title="Add New User" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute>
                    <Edit title="Update User" />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="hotel">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={hotelColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":hotelId"
                element={
                  <ProtectedRoute>
                    <SingleHotel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewHotel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute>
                    <EditHotel />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="food">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={foodColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":foodId"
                element={
                  <ProtectedRoute>
                    <SingleFood />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewFood />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:id"
                element={<ProtectedRoute>
                  <EditFood />
                  </ProtectedRoute>}
              />
            </Route>
            <Route path="comment">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={reviewColumns} />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
