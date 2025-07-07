import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Kullanıcı Bulunamadı</h2>
        <p className="text-gray-600 mb-8">Aradığınız kullanıcı mevcut değil veya silinmiş olabilir.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-gray-700 mb-2">Yardım için iletişime geçin:</p>
          <a 
            href="mailto:cuneytdonmez8@gmail.com"
            className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors"
          >
            cuneytdonmez8@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;