import React from 'react';

const Progress = ({ selectedAnswers = {}, totalQuestions, openEndedAnswers = {} }) => { // Berikan nilai default sebagai objek kosong
  // Hitung jumlah jawaban yang dipilih
  const currentQuestion = Object.keys(selectedAnswers, openEndedAnswers).length;

  // Pastikan currentQuestion dan totalQuestions memiliki nilai yang valid
  const validCurrentQuestion = currentQuestion > 0 ? currentQuestion : 0;
  const validTotalQuestions = totalQuestions > 0 ? totalQuestions : 1; // Hindari pembagian dengan 0

  // Hitung persentase progress
  const percentage = Math.round((validCurrentQuestion / validTotalQuestions) * 100);

  return (
    <div className="w-full p-4">
      <div className="text-sm mb-2">
        Progress: {validCurrentQuestion}/{validTotalQuestions} ({percentage}%)
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-gradient-to-l from-[#00bcc1] to-[#30b7bb] h-4 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;
