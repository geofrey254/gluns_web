import React, { useState } from 'react'
import {
  ChevronRight,
  LogOut,
  Save,
  CheckCircle,
  Clock,
  Users,
  Globe,
  FileText,
  UserPlus,
  Briefcase,
  Upload,
  Menu,
  Pencil,
  Trash2,
  Home,
  Award,
  FileUp,
  X,
  Check,
} from 'lucide-react'

// Mock data for demonstration
const mockUser = { id: '1', name: 'John Doe' }
const mockDelegation = { id: '1' }

export default function DelegationPortal() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('application')
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    delegationName: '',
    countryOfOrigin: '',
    numberOfDelegates: 1,
    numberOfFacultyAdvisors: 0,
    previousExperience: '',
    hmunExperience: '',
    preferredRegions: '',
    prefersDoubleDelegations: 'no',
    crisisCommitteeRequests: '',
    committeeInterests: 'novice',
    status: 'pending',
  })

  const steps = [
    { title: 'Basic Info', icon: Users, description: 'Essential delegation details' },
    { title: 'Experience', icon: FileText, description: 'Background & history' },
    { title: 'Preferences', icon: Globe, description: 'Committee interests' },
  ]

  const menuItems = [
    { id: 'application', label: 'Application', icon: Home },
    { id: 'delegates', label: 'Delegates', icon: UserPlus },
    { id: 'advisors', label: 'Faculty Advisors', icon: Briefcase },
    { id: 'assignments', label: 'Assignments', icon: Award },
    { id: 'papers', label: 'Position Papers', icon: FileUp },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        <div className="h-full flex flex-col">
          {/* Logo & Close */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#104179]">GLUNS Portal</h2>
                <p className="text-sm text-gray-500 mt-1">Delegation Management</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="px-6 py-4">
            <div
              className={`
              flex items-center gap-3 p-3 rounded-xl
              ${formData.status === 'pending' ? 'bg-amber-50' : 'bg-emerald-50'}
            `}
            >
              {formData.status === 'pending' ? (
                <Clock className="w-5 h-5 text-amber-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              )}
              <div>
                <p className="text-xs font-medium text-gray-600">Application Status</p>
                <p
                  className={`text-sm font-bold capitalize
                  ${formData.status === 'pending' ? 'text-amber-700' : 'text-emerald-700'}
                `}
                >
                  {formData.status}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3.5 mb-1 rounded-xl text-left transition-all
                    ${
                      isActive
                        ? 'bg-[#104179] text-white shadow-lg shadow-[#104179]/20'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-base">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
              <div className="w-10 h-10 rounded-full bg-[#104179] flex items-center justify-center text-white font-bold">
                {mockUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{mockUser.name}</p>
                <p className="text-sm text-gray-500">Delegation Lead</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {activeSection === 'application' && 'Application'}
                    {activeSection === 'delegates' && 'Delegates'}
                    {activeSection === 'advisors' && 'Faculty Advisors'}
                    {activeSection === 'assignments' && 'Country Assignments'}
                    {activeSection === 'papers' && 'Position Papers'}
                  </h1>
                  <p className="text-base text-gray-600 mt-1">
                    {activeSection === 'application' && 'Complete your delegation application'}
                    {activeSection === 'delegates' && 'Register your delegation members'}
                    {activeSection === 'advisors' && 'Add faculty advisor information'}
                    {activeSection === 'assignments' && 'View your country assignments'}
                    {activeSection === 'papers' && 'Upload your position papers'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-5xl mx-auto">
            {activeSection === 'application' && (
              <div className="space-y-6">
                {/* Progress Tracker */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => {
                      const Icon = step.icon
                      const isActive = currentStep === index
                      const isCompleted = currentStep > index

                      return (
                        <React.Fragment key={index}>
                          <div className="flex flex-col items-center flex-1">
                            <div
                              className={`
                              w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all border-2
                              ${
                                isActive
                                  ? 'bg-[#104179] border-[#104179] text-white scale-105 shadow-lg'
                                  : isCompleted
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'bg-white border-gray-300 text-gray-400'
                              }
                            `}
                            >
                              {isCompleted ? (
                                <Check className="w-7 h-7" />
                              ) : (
                                <Icon className="w-7 h-7" />
                              )}
                            </div>
                            <span
                              className={`
                              text-sm sm:text-base font-semibold text-center mb-1
                              ${isActive ? 'text-[#104179]' : isCompleted ? 'text-emerald-600' : 'text-gray-500'}
                            `}
                            >
                              {step.title}
                            </span>
                            <span className="text-xs text-gray-500 text-center hidden sm:block">
                              {step.description}
                            </span>
                          </div>
                          {index < steps.length - 1 && (
                            <div className="flex-1 h-1 mx-3 mb-12 max-w-[120px]">
                              <div
                                className={`
                                h-full rounded-full transition-all
                                ${currentStep > index ? 'bg-emerald-500' : 'bg-gray-200'}
                              `}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </div>

                  {/* Form Content */}
                  <div className="mt-8">
                    {currentStep === 0 && (
                      <div className="space-y-6">
                        <div className="pb-4 border-b border-gray-200">
                          <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                          <p className="text-base text-gray-600 mt-2">
                            Tell us about your delegation
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label className="block text-base font-semibold text-gray-900 mb-2">
                              Delegation Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              name="delegationName"
                              value={formData.delegationName}
                              onChange={handleChange}
                              placeholder="Enter your delegation name"
                              className="w-full border-2 border-gray-300 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#104179] focus:border-[#104179] transition-all text-base"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-base font-semibold text-gray-900 mb-2">
                              Country of Origin <span className="text-red-500">*</span>
                            </label>
                            <input
                              name="countryOfOrigin"
                              value={formData.countryOfOrigin}
                              onChange={handleChange}
                              placeholder="Enter your country"
                              className="w-full border-2 border-gray-300 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#104179] focus:border-[#104179] transition-all text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-base font-semibold text-gray-900 mb-2">
                              Number of Delegates <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="numberOfDelegates"
                              value={formData.numberOfDelegates}
                              onChange={handleChange}
                              min={1}
                              className="w-full border-2 border-gray-300 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#104179] focus:border-[#104179] transition-all text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-base font-semibold text-gray-900 mb-2">
                              Number of Faculty Advisors <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="numberOfFacultyAdvisors"
                              value={formData.numberOfFacultyAdvisors}
                              onChange={handleChange}
                              min={0}
                              className="w-full border-2 border-gray-300 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#104179] focus:border-[#104179] transition-all text-base"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="pb-4 border-b border-gray-200">
                          <h2 className="text-2xl font-bold text-gray-900">
                            Experience & Background
                          </h2>
                          <p className="text-base text-gray-600 mt-2">
                            Share your MUN experience with us
                          </p>
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-900 mb-2">
                            Previous MUN Experience <span className="text-red-500">*</span>
                          </label>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            Describe your delegation's previous experiences with Model United
                            Nations. If you don't have any MUN experience, please describe other
                            relevant experiences such as debate, public speaking, or mock trial.
                          </p>
                          <textarea
                            name="previousExperience"
                            value={formData.previousExperience}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Tell us about your experience..."
                            className="w-full border-2 border-gray-300 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#104179] focus:border-[#104179] transition-all resize-none text-base"
                          />
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-900 mb-2">
                            GLUNS Experience <span className="text-red-500">*</span>
                          </label>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            Has your delegation participated in GLUNS before? If so, how many years?
                          </p>
                          <input
                            name="hmunExperience"
                            value={formData.hmunExperience}
                            onChange={handleChange}
                            placeholder="e.g., First time, 2 years, etc."
                            className="w-full border-2 border-gray-300 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#104179] focus:border-[#104179] transition-all text-base"
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="pb-4 border-b border-gray-200">
                          <h2 className="text-2xl font-bold text-gray-900">
                            Committee Preferences
                          </h2>
                          <p className="text-base text-gray-600 mt-2">
                            Help us assign the best committees for your delegation
                          </p>
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-900 mb-2">
                            Preferred Regions
                          </label>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            Is there a type of country or region of the world in which your
                            delegation is particularly interested?
                          </p>
                          <input
                            name="preferredRegions"
                            value={formData.preferredRegions}
                            onChange={handleChange}
                            maxLength={255}
                            placeholder="e.g., Latin America, Southeast Asia, etc."
                            className="w-full border-2 border-gray-300 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#104179] focus:border-[#104179] transition-all text-base"
                          />
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-900 mb-2">
                            Double Delegations <span className="text-red-500">*</span>
                          </label>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            Does your delegation prefer double delegations (e.g., DISEC, SOCHUM,
                            SPECPOL, Legal Committee, UNSC)?
                          </p>
                          <select
                            name="prefersDoubleDelegations"
                            value={formData.prefersDoubleDelegations}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-300 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#104179] focus:border-[#104179] transition-all bg-white text-base"
                          >
                            <option value="yes">Yes, we prefer double delegations</option>
                            <option value="no">No, we prefer single delegations</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-900 mb-2">
                            Crisis Committee Requests
                          </label>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            How many allocations in our Crisis Committees would your delegation
                            like? Which specific committees? Note: Allocations are limited.
                          </p>
                          <textarea
                            name="crisisCommitteeRequests"
                            value={formData.crisisCommitteeRequests}
                            onChange={handleChange}
                            maxLength={255}
                            rows={4}
                            placeholder="Specify your crisis committee preferences..."
                            className="w-full border-2 border-gray-300 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#104179] focus:border-[#104179] transition-all resize-none text-base"
                          />
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-900 mb-2">
                            Committee Interests <span className="text-red-500">*</span>
                          </label>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            Select your interest in specialized committees. We recommend experienced
                            delegates for advanced committees.
                          </p>
                          <select
                            name="committeeInterests"
                            value={formData.committeeInterests}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-300 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#104179] focus:border-[#104179] transition-all bg-white text-base"
                          >
                            <option value="advanced">
                              Advanced Committees (AHCSG, AHCDG, UNSC)
                            </option>
                            <option value="press">Press Corps Committee</option>
                            <option value="novice">Novice Committee (Limited/No Experience)</option>
                            <option value="spanish">Bilingual Spanish Committee</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                      {currentStep > 0 && (
                        <button
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="px-6 py-3.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold text-base"
                        >
                          Previous
                        </button>
                      )}
                      <div className="flex-1" />
                      {currentStep < steps.length - 1 ? (
                        <button
                          onClick={() => setCurrentStep(currentStep + 1)}
                          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#104179] text-white rounded-xl hover:bg-[#0d3461] transition-all font-semibold shadow-lg shadow-[#104179]/20 text-base"
                        >
                          Next Step
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      ) : (
                        <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#104179] text-white rounded-xl hover:bg-[#0d3461] transition-all font-semibold shadow-lg shadow-[#104179]/20 text-base">
                          <Save className="w-5 h-5" />
                          Save Application
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Help Card */}
                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#104179] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Need Help?</h3>
                      <p className="text-base text-gray-700 leading-relaxed">
                        All fields marked with <span className="text-red-500 font-semibold">*</span>{' '}
                        are required. You can save your progress at any time and return later to
                        complete your application.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Sections - Empty States */}
            {activeSection !== 'application' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
                <div className="text-center max-w-md mx-auto">
                  {activeSection === 'delegates' && (
                    <>
                      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
                        <UserPlus className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Add Delegates</h3>
                      <p className="text-base text-gray-600 mb-6 leading-relaxed">
                        Register your delegation members here once your application is approved and
                        payment is complete.
                      </p>
                      <button className="px-6 py-3.5 bg-[#104179] text-white rounded-xl hover:bg-[#0d3461] transition-all font-semibold shadow-lg shadow-[#104179]/20 text-base">
                        Add Delegate
                      </button>
                    </>
                  )}
                  {activeSection === 'advisors' && (
                    <>
                      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Faculty Advisors</h3>
                      <p className="text-base text-gray-600 mb-6 leading-relaxed">
                        Add your faculty advisors to complete your delegation team.
                      </p>
                      <button className="px-6 py-3.5 bg-[#104179] text-white rounded-xl hover:bg-[#0d3461] transition-all font-semibold shadow-lg shadow-[#104179]/20 text-base">
                        Add Faculty Advisor
                      </button>
                    </>
                  )}
                  {activeSection === 'assignments' && (
                    <>
                      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
                        <Globe className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Country Assignments</h3>
                      <p className="text-base text-gray-600 leading-relaxed">
                        Your country assignments will appear here once they are finalized by the
                        organizers.
                      </p>
                    </>
                  )}
                  {activeSection === 'papers' && (
                    <>
                      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
                        <Upload className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Position Papers</h3>
                      <p className="text-base text-gray-600 mb-6 leading-relaxed">
                        Upload your position papers for your assigned countries and committees.
                      </p>
                      <button className="px-6 py-3.5 bg-[#104179] text-white rounded-xl hover:bg-[#0d3461] transition-all font-semibold shadow-lg shadow-[#104179]/20 text-base">
                        Upload Position Paper
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
