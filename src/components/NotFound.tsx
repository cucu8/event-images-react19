import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Kullanıcı Bulunamadı</h2>
        <p className="text-gray-600 mb-8">Aradığınız kullanıcı mevcut değil veya silinmiş olabilir.</p>
        <button 
          onClick={() => window.history.back()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Geri Dön
        </button>
      </div>
    </div>
  );
};

export default NotFound;