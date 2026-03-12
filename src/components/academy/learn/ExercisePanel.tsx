import { useState } from 'react'
import {
  RiQuestionLine,
  RiCheckLine,
  RiCloseLine,
  RiStarFill,
  RiSendPlaneFill,
  RiRefreshLine,
  RiTrophyFill,
  RiLightbulbFlashLine,
} from 'react-icons/ri'

export default function ExercisePanel({ exercise }: { exercise: Exercise }) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const correctAnswer =
    (exercise as Exercise & { correctAnswer?: string }).correctAnswer?.trim().toLowerCase() || ''

  const handleSubmit = () => {
    if (!answer.trim()) return
    setSubmitted(true)
    if (correctAnswer) {
      setIsCorrect(answer.trim().toLowerCase() === correctAnswer)
    } else {
      setIsCorrect(null)
    }
  }

  const handleReset = () => {
    setAnswer('')
    setSubmitted(false)
    setIsCorrect(null)
  }

  return (
    <div
      className="mt-6 rounded-2xl border-2 border-black overflow-hidden"
      style={{ boxShadow: '4px 4px 0px #85c226' }}
    >
      {/* Header */}
      <div className="bg-[#85c226] px-5 py-3 flex items-center gap-3 border-b-2 border-black">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black">
          <RiQuestionLine className="w-4 h-4 text-[#85c226]" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-black">
          Practice Exercise
        </span>
        <div className="ml-auto flex gap-1">
          {[0, 1, 2].map((i) => (
            <RiStarFill key={i} className="w-4 h-4 text-black opacity-30" />
          ))}
        </div>
      </div>

      <div className="bg-white p-5">
        {/* Question */}
        {exercise.question && (
          <div className="flex gap-3 mb-4">
            <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#104179] text-white text-xs font-black">
              Qn.{exercise.id}
            </span>
            <p className="text-base font-black text-black leading-snug">{exercise.question}</p>
          </div>
        )}

        {/* Instructions */}
        {exercise.instructions && (
          <div className="flex items-start gap-2 mb-4 bg-blue-50 border-2 border-[#104179] rounded-xl px-3 py-2">
            <RiLightbulbFlashLine className="w-4 h-4 text-[#104179] mt-0.5 shrink-0" />
            <p className="text-sm text-[#104179] font-semibold">{exercise.instructions}</p>
          </div>
        )}

        {/* Answer Input */}
        {!submitted ? (
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1">
              Your Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={3}
              className="w-full rounded-xl border-2 border-black px-4 py-3 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#85c226] resize-none"
              style={{ boxShadow: '2px 2px 0px #000' }}
            />
            <button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#104179] text-white text-sm font-black border-2 border-black disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ boxShadow: answer.trim() ? '3px 3px 0px #000' : 'none' }}
            >
              <RiSendPlaneFill className="w-4 h-4" />
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Submitted answer display */}
            <div className="rounded-xl border-2 border-black bg-gray-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
                Your Answer
              </p>
              <p className="text-sm font-semibold text-black">{answer}</p>
            </div>

            {/* Feedback */}
            {isCorrect !== null ? (
              <div
                className={`rounded-xl border-2 border-black px-4 py-3 flex items-center gap-3 ${
                  isCorrect ? 'bg-[#85c226]' : 'bg-red-50'
                }`}
                style={{ boxShadow: '3px 3px 0px #000' }}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-black shrink-0 ${
                    isCorrect ? 'bg-black' : 'bg-red-500'
                  }`}
                >
                  {isCorrect ? (
                    <RiCheckLine className="w-4 h-4 text-[#85c226]" />
                  ) : (
                    <RiCloseLine className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-black">
                    {isCorrect ? '🎉 Correct! Great job!' : '❌ Not quite right!'}
                  </p>
                  {!isCorrect && correctAnswer && (
                    <p className="text-xs font-semibold text-black mt-0.5">
                      Correct answer: <span className="font-black">{correctAnswer}</span>
                    </p>
                  )}
                </div>
                {isCorrect && <RiTrophyFill className="w-5 h-5 text-black ml-auto" />}
              </div>
            ) : (
              <div
                className="rounded-xl border-2 border-black bg-[#85c226] px-4 py-3 flex items-center gap-3"
                style={{ boxShadow: '3px 3px 0px #000' }}
              >
                <RiCheckLine className="w-5 h-5 text-black shrink-0" />
                <p className="text-sm font-black text-black">
                  Answer submitted! Your teacher will review it. 📝
                </p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-black border-2 border-black"
              style={{ boxShadow: '2px 2px 0px #000' }}
            >
              <RiRefreshLine className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
