import { useEffect, useState } from 'react';
import Link from 'next/link';
import Progress from './progress';

const Sidebar = ({ isOpen, currentPage, totalQuestions, quizz_id, openEndedAnswers = {} }) => {
  const QUESTIONS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSelectedAnswers = localStorage.getItem('selectedAnswers');
      if (savedSelectedAnswers) {
        setSelectedAnswers(JSON.parse(savedSelectedAnswers));
      }
    }
  }, []);

  const getPageStatus = (page) => {
    const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;

    const answersInPage = Object.keys(selectedAnswers).filter((questionId) => {
      const questionIndex = parseInt(questionId, 10);
      return questionIndex >= startIndex && questionIndex < endIndex;
    });

    // Memeriksa openEndedAnswers
    const openEndedInPage = Object.keys(openEndedAnswers).filter((questionId) => {
      const questionIndex = parseInt(questionId, 10);
      return questionIndex >= startIndex && questionIndex < endIndex;
    });

    const totalAnswered = answersInPage.length + openEndedInPage.length;

    if (totalAnswered === 0) {
      return 'gray'; // Tidak ada jawaban
    } else if (totalAnswered > 0 && totalAnswered < QUESTIONS_PER_PAGE) {
      return 'yellow'; // Beberapa jawaban terisi
    } else if (totalAnswered === QUESTIONS_PER_PAGE) {
      return 'green'; // Semua jawaban terisi
    }
  };

  return (
    <div
      className={`fixed left-8 top-1/3 transform -translate-y-1/4 bg-[#f2f2f2] text-black p-4 rounded-lg shadow-lg z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } sm:w-32 md:w-40 lg:w-64`}
      style={{ maxHeight: 'calc(100vh - 2rem)' }}
    >
      <h2 className="text-sm text-center text-[#33A6A6] font-semibold mb-4 tracking-wider">HALAMAN</h2>

      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageStatus = getPageStatus(i + 1);
          const pageColor = pageStatus === 'gray'
            ? 'bg-[#edeef1]'
            : pageStatus === 'yellow'
            ? 'bg-yellow-400'
            : 'bg-green-400';

          return (
            <Link
              key={i + 1}
              href={`/kuesioner/${quizz_id}?page=${i + 1}`}
              className={`flex justify-center items-center p-2 rounded-lg text-lg font-semibold transition-colors duration-200 ${
                currentPage === i + 1 ? 'bg-[#33A6A6] text-white' : `${pageColor} text-black hover:bg-[#007ee3] hover:text-white`
              }`}
            >
              {i + 1}
            </Link>
          );
        })}
      </div>

      <Progress 
        currentPage={currentPage} 
        totalQuestions={totalQuestions} 
        selectedAnswers={selectedAnswers} 
        openEndedAnswers={openEndedAnswers} 
      />
    </div>
  );
};

export default Sidebar;
