import { CheckCircle } from 'lucide-react'
import React from 'react'

export default function DelegationSteps({
  steps,
  currentStep,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  steps: { title: string; icon: React.ComponentType<any> }[]
  currentStep: number
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === index
          const isCompleted = currentStep > index
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isActive
                      ? 'bg-[#104179] text-white shadow-lg scale-110'
                      : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium text-center ${
                    isActive ? 'text-[#104179]' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 mb-8">
                  <div
                    className={`h-full rounded transition-colors ${
                      currentStep > index ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
