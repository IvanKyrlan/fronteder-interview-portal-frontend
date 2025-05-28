import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  FaExclamationTriangle,
  FaHome,
  FaArrowLeft,
  FaSync,
} from 'react-icons/fa';

class ForumErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Forum component error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaExclamationTriangle className="text-red-500 text-3xl" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Щось пішло не так
              </h2>

              <p className="text-gray-600 mb-6">
                На жаль, виникла помилка при завантаженні компонента форуму.
                Спробуйте оновити сторінку або повернутися на головну.
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReload}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700  flex items-center justify-center"
                >
                  <FaSync className="mr-2" />
                  Оновити сторінку
                </button>

                <Link
                  to="/forum"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50  flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Повернутися до форуму
                </Link>

                <Link
                  to="/"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50  flex items-center justify-center"
                >
                  <FaHome className="mr-2" />
                  На головну
                </Link>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-8 p-4 bg-gray-100 rounded-md text-left">
                  <p className="font-bold text-red-500">Помилка:</p>
                  <pre className="mt-2 text-sm overflow-auto whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <p className="font-bold text-red-500 mt-4">
                        Стек викликів:
                      </p>
                      <pre className="mt-2 text-sm overflow-auto whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ForumErrorBoundary;
