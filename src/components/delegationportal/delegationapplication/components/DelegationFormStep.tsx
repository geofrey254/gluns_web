import React from 'react'
import { Delegation } from '@/app/types/types'
import { ChevronRight, Save } from 'lucide-react'

export default function DelegationFormStep({
  currentStep,
  formData,
  handleChange,
  nextStep,
  prevStep,
  handleSave,
  saving,
  stepsLength,
  isDelegateAccount,
}: {
  currentStep: number
  formData: Delegation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (e: React.ChangeEvent<any>) => void
  nextStep: () => void
  prevStep: () => void
  handleSave: () => void
  saving: boolean
  stepsLength: number
  isDelegateAccount?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      {currentStep === 0 && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isDelegateAccount ? 'Delegate Details' : 'Basic Information'}
          </h2>
          {isDelegateAccount && (
            <div className="rounded-xl border border-[#104179]/10 bg-[#104179]/5 p-4 text-sm text-[#104179]">
              This registration is for a single delegate account. The portal will keep the same
              approval and payment flow, but the wording is tailored for individual students.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delegation Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isDelegateAccount ? 'Delegate Full Name' : 'Delegation Name'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="delegationName"
                value={formData.delegationName}
                onChange={handleChange}
                placeholder={
                  isDelegateAccount ? 'Enter your full name' : 'Enter your delegation name'
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Country of Origin */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isDelegateAccount ? 'Country of Residence' : 'Country of Origin'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={handleChange}
                placeholder={
                  isDelegateAccount ? 'Enter your country of residence' : 'Enter your country'
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>

            {!isDelegateAccount ? (
              <>
                {/* Number of Delegates */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Delegates <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfDelegates"
                    value={formData.numberOfDelegates}
                    placeholder="Enter the number of delegates"
                    onChange={handleChange}
                    min={1}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>

                {/* Number of Faculty Advisors */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Faculty Advisors <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfFacultyAdvisors"
                    placeholder="Enter the number of faculty advisors"
                    value={formData.numberOfFacultyAdvisors}
                    onChange={handleChange}
                    min={0}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </>
            ) : (
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Delegate Count
                  </p>
                  <p className="text-lg font-semibold text-gray-900">1 delegate</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Faculty Advisors
                  </p>
                  <p className="text-lg font-semibold text-gray-900">0 advisors</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isDelegateAccount ? 'Delegate Background' : 'Experience & Background'}
            </h2>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Previous MUN / Debate Experience' : 'Previous MUN Experience'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              {isDelegateAccount
                ? 'Tell us about your Model United Nations, debate, public speaking, or leadership experience.'
                : "Describe your delegation's previous experiences with Model United Nations. If you don't have any MUN experience, please describe other relevant experiences such as debate, public speaking, or mock trial."}
            </p>
            <textarea
              name="previousExperience"
              value={formData.previousExperience}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us about your experience..."
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Grade / Year Level' : 'GLUNS Experience'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              {isDelegateAccount
                ? 'Tell us your current grade or year level.'
                : 'Has your delegation participated in GLUNS before? If so, how many years?'}
            </p>
            <input
              name="hmunExperience"
              value={formData.hmunExperience}
              onChange={handleChange}
              placeholder="e.g., First time, 2 years, etc."
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isDelegateAccount ? 'Delegate Preferences' : 'Committee Preferences'}
            </h2>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Preferred Committees / Tracks' : 'Preferred Regions'}
            </label>
            <p className="text-sm text-gray-600 mb-2">
              {isDelegateAccount
                ? 'Tell us which committees or conference tracks you would like to join.'
                : 'Is there a type of country or region of the world in which your delegation is particularly interested? (max 255 characters)'}
            </p>
            <input
              name="preferredRegions"
              value={formData.preferredRegions}
              onChange={handleChange}
              maxLength={255}
              placeholder="e.g., Latin America, Southeast Asia, etc."
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Single Delegate Registration' : 'Double Delegations'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              {isDelegateAccount
                ? 'This account is registered as a single delegate, so the portal will keep this set to no.'
                : 'Does your delegation prefer double delegations (e.g., DISEC, SOCHUM, SPECPOL, Legal Committee, UNSC)?'}
            </p>
            <select
              name="prefersDoubleDelegations"
              value={formData.prefersDoubleDelegations}
              onChange={handleChange}
              title="Select whether your delegation prefers double delegations"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
            >
              <option value="yes" disabled={isDelegateAccount}>
                Yes, we prefer double delegations
              </option>
              <option value="no">No, we prefer single delegations</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Special Requests' : 'Crisis Committee Requests'}
            </label>
            <p className="text-sm text-gray-600 mb-2">
              {isDelegateAccount
                ? 'Share any accessibility, scheduling, or committee preferences here. (max 255 characters)'
                : 'How many allocations in our Crisis Committees would your delegation like? Which specific committees? (max 255 characters) Note: Allocations are limited.'}
            </p>
            <textarea
              name="crisisCommitteeRequests"
              value={formData.crisisCommitteeRequests}
              onChange={handleChange}
              maxLength={255}
              rows={3}
              placeholder="Specify your crisis committee preferences..."
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Committee Interest' : 'Committee Interests'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              {isDelegateAccount
                ? 'Select the type of committee you would like to join.'
                : 'Select your interest in specialized committees. We recommend experienced delegates for advanced committees and require limited/no crisis experience for novice committees.'}
            </p>
            <select
              name="committeeInterests"
              value={formData.committeeInterests}
              onChange={handleChange}
              title="Select your committee interest"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
            >
              <option value="advanced">Advanced Committees (AHCSG, AHCDG, UNSC)</option>
              <option value="press">Press Corps Committee</option>
              <option value="novice">Novice Committee (Limited/No Experience)</option>
              <option value="spanish">Bilingual Spanish Committee</option>
            </select>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
        <div className="flex gap-3 flex-1">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Previous
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {currentStep < stepsLength - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#104179] text-white rounded-lg hover:bg-[#0d3a66] transition-colors font-medium shadow-md hover:shadow-lg"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#104179] text-white rounded-lg hover:bg-[#0d3a66] transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Delegation'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
