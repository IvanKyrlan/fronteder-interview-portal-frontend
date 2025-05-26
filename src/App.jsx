import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store";
import "./App.css";

import Header from "./components/navigation/Header";
import Footer from "./components/navigation/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import BackToTopButton from "./components/common/BackToTopButton";

import Home from "./pages/Home";
import TestPracticePage from "./pages/TestPracticePage";
import TestPage from "./pages/TestPage";
import TaskPage from "./pages/TaskPage";
import ProfilePage from "./pages/ProfilePage";
import ArticlePage from "./pages/ArticlePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import DirectoriesPage from "./pages/DirectoriesPage";
import InterviewVideosPage from "./pages/InterviewVideosPage";
import AboutPage from "./pages/AboutPage";
import ContactsPage from "./pages/ContactsPage";

import ForumPage from "./pages/ForumPage";
import ForumTopicPage from "./pages/ForumTopicPage";
import ForumErrorBoundary from "./components/forum/ErrorBoundary";

import LoginRegisterPage from "./pages/LoginRegisterPage";
import PrivateRoute from "./components/navigation/PrivateRoute";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/directories" element={<DirectoriesPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/articles" element={<ArticlePage />} />
              <Route path="/articles/:slug" element={<ArticleDetailPage />} />
              <Route path="/interviews" element={<InterviewVideosPage />} />
              <Route path="/tests" element={<TestPracticePage />} />
              <Route path="/tests/:testId" element={<TestPage />} />
              <Route path="/tests/:testId/start" element={<TestPage />} />
              <Route path="/tests/:testId/result" element={<TestPage />} />
              <Route path="/tests/:testId/tasks" element={<TaskPage />} />
              <Route
                path="/tests/:testId/tasks/result"
                element={<TaskPage />}
              />

              <Route
                path="/forum"
                element={
                  <ForumErrorBoundary>
                    <ForumPage />
                  </ForumErrorBoundary>
                }
              />
              <Route
                path="/forum/topics/:topicId"
                element={
                  <ForumErrorBoundary>
                    <ForumTopicPage />
                  </ForumErrorBoundary>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={
                  <div className="text-center mx-auto px-4 py-8">
                    Сторінку не знайдено
                  </div>
                }
              />
              <Route
                path="/login"
                element={<LoginRegisterPage initialMode="login" />}
              />
              <Route
                path="/register"
                element={<LoginRegisterPage initialMode="register" />}
              />
            </Routes>
          </main>
          <BackToTopButton />
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}
