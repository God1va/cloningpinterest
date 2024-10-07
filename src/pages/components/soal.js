import { useRouter } from 'next/router'; 
import { useEffect, useState } from 'react'; 

const QUESTIONS_PER_PAGE = 10; 

const SoalPage = ({ quizz_id, currentPage }) => { 
  const router = useRouter(); 
  const [questions, setQuestions] = useState([]); 
  const [quizTitle, setQuizTitle] = useState(''); 
  const [quizDescription, setQuizDescription] = useState(''); 
  const [loading, setLoading] = useState(true); 
  const [selectedAnswers, setSelectedAnswers] = useState({}); 
  const [openEndedAnswers, setOpenEndedAnswers] = useState({}); 

  useEffect(() => { 
    const fetchQuestionsAndAnswers = async () => { 
      try { 
        const questionsResponse = await fetch( 
          `http://10.10.10.75:8000/api/quizz/${quizz_id}/questions` 
        ); 
        const questionsData = await questionsResponse.json(); 

        setQuestions(questionsData.data?.questions || []); 
        setQuizTitle(questionsData.data?.title_quiz || ''); 
        setQuizDescription(questionsData.data?.description || '');  

        // Ambil jawaban dari localStorage
        const savedOpenEndedAnswers = localStorage.getItem('openEndedAnswers');
        const savedSelectedAnswers = localStorage.getItem('selectedAnswers');

        if (savedOpenEndedAnswers) {
          setOpenEndedAnswers(JSON.parse(savedOpenEndedAnswers));
        }
        if (savedSelectedAnswers) {
          setSelectedAnswers(JSON.parse(savedSelectedAnswers));
        }

        setLoading(false); 
      } catch (error) { 
        console.error('Error fetching data:', error); 
        setLoading(false); 
      } 
    }; 

    if (quizz_id) { 
      fetchQuestionsAndAnswers(); 
    } 
  }, [quizz_id]); 

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE; 
  const endIndex = startIndex + QUESTIONS_PER_PAGE; 

  const handleNext = async () => {
    await submitAnswers(); // Submit answers before navigating
    router.push(`/kuesioner/${quizz_id}?page=${currentPage + 1}`); 
  }; 

  const handleBack = () => { 
    if (currentPage > 1) { 
      router.push(`/kuesioner/${quizz_id}?page=${currentPage - 1}`); 
    } 
  }; 

  const handleAnswerChange = (questionId, answerId) => { 
    setSelectedAnswers((prevAnswers) => { 
      const newAnswers = { 
        ...prevAnswers, 
        [questionId]: answerId, 
      };

      // Simpan di localStorage
      localStorage.setItem('selectedAnswers', JSON.stringify(newAnswers));

      return newAnswers; 
    }); 
  }; 

  const handleOpenEndedChange = (questionId, value) => { 
    setOpenEndedAnswers((prevAnswers) => { 
      const updatedAnswers = { 
        ...prevAnswers, 
        [questionId]: value, 
      };

      // Simpan di localStorage
      localStorage.setItem('openEndedAnswers', JSON.stringify(updatedAnswers));

      return updatedAnswers; 
    }); 
  }; 

  const clearAnswer = (questionId) => { 
    setSelectedAnswers((prevAnswers) => { 
      const newAnswers = { ...prevAnswers }; 
      delete newAnswers[questionId]; 
      localStorage.setItem('selectedAnswers', JSON.stringify(newAnswers)); // Update localStorage
      return newAnswers; 
    }); 
    setOpenEndedAnswers((prevAnswers) => { 
      const newAnswers = { ...prevAnswers }; 
      delete newAnswers[questionId]; 
      localStorage.setItem('openEndedAnswers', JSON.stringify(newAnswers)); // Update localStorage
      return newAnswers; 
    }); 
  }; 

  const submitAnswers = async () => {
    const payload = {
      quiz_id: quizz_id,
      selected_answers: selectedAnswers,
      open_ended_answers: openEndedAnswers,
    };

    try {
      const response = await fetch('http://10.10.10.75:8000/api/user-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error submitting answers');
      }

      console.log('Answers submitted successfully');
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  if (loading) { 
    return <p>Loading...</p>; 
  } 

  return ( 
    <div className="bg-pattern bg-[#f2f2f2] flex flex-col items-end pr-8 font-montserrat"> 
      <div 
        className="w-full max-w-6xl bg-[#f3f3f3] shadow-lg rounded-xl p-6 relative" 
        style={{ height: 'calc(100vh - 120px)', marginTop: '80px' }} 
      > 
        <h1 className="text-2xl font-bold mb-2 text-center text-[#33A6A6]"> 
          {quizTitle} 
        </h1> 
        <p className="text-center text-[#768591] mb-4">{quizDescription}</p> 

        <h2 className="text-xl font-bold mb-4 text-center bg-[#f3f3f3] text-[#33A6A6] sticky top-0 z-10 bg-white pb-4"> 
          Halaman {currentPage} 
        </h2> 

        <div 
          className="overflow-y-auto" 
          style={{ maxHeight: 'calc(100% - 160px)', paddingBottom: '40px' }} 
        > 
          <div className="space-y-8 text-sm"> 
            {questions.slice(startIndex, endIndex).map((q, index) => ( 
              <div key={q.id} className="bg-[#ffffff] p-4 rounded-lg shadow-md flex justify-between items-start"> 
                <div className="flex-1"> 
                  <h2 className="text-base font-semibold text-[#768591] mb-2 text-lg"> 
                    {startIndex + index + 1}. {q.questions} 
                  </h2> 

                  {q.answer_type === 'Choice' && q.answers.length > 0 ? ( 
                    <ul className="space-y-2"> 
                      {q.answers
                        .filter((option) => option.answer !== "") // Filter jawaban kosong
                        .map((option) => ( 
                          <li key={option.id}> 
                            <label className="flex items-center p-3 rounded-md cursor-pointer hover:brightness-90 hover:text-white"> 
                              <input 
                                type="radio" 
                                name={`question-${q.id}`} 
                                className="form-radio h-4 w-4 text-[#33A6A6] mr-2 text-lg" 
                                onChange={() => handleAnswerChange(q.id, option.id)} 
                                checked={selectedAnswers[q.id] === option.id} 
                              /> 
                              <span className="text-[#768591] text-lg"> 
                                {option.answer} 
                              </span> 
                            </label> 
                          </li> 
                        ))} 
                    </ul> 
                  ) : (
                    <div> 
                      <textarea 
                        className="w-full p-3 border rounded-md text-gray-600" 
                        placeholder="Tuliskan jawaban Anda di sini..." 
                        rows="4" 
                        value={openEndedAnswers[q.id] || ''} // Tampilkan jawaban yang sudah disimpan
                        onChange={(e) => handleOpenEndedChange(q.id, e.target.value)} 
                      /> 
                    </div> 
                  )}
                </div> 

                {(selectedAnswers[q.id] || openEndedAnswers[q.id]) && ( 
                  <button 
                    className="text-left mt-2 text-rose-500" 
                    onClick={() => clearAnswer(q.id)} 
                  > 
                    Clear Answer 
                  </button> 
                )} 
              </div> 
            ))} 
          </div> 

          <div className="flex justify-between mt-4"> 
            <button 
              onClick={handleBack} 
              className={`px-4 py-2 bg-[#007ee3] text-white font-semibold rounded-lg ${ 
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : '' 
              }`} 
              disabled={currentPage === 1} 
            > 
              Back 
            </button> 
            <button 
              onClick={handleNext} 
              className="px-4 py-2 bg-[#007ee3] text-white font-semibold rounded-lg" 
            > 
              Next 
            </button> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
}; 

export default SoalPage;
