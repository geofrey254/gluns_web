import React from 'react'
import { Delegation } from '@/app/types/types'
import { LogOut, CheckCircle, Clock, Menu } from 'lucide-react'

export default function DelegationHeader({
  activeSection,
  formData,
  loggingOut,
  onLogout,
  onOpenSidebar,
}: {
  activeSection: string
  formData: Delegation
  loggingOut: boolean
  onLogout: () => void
  onOpenSidebar: () => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {activeSection === 'application' && 'Delegation Portal'}
              {activeSection === 'delegates' && 'Add Delegates'}
              {activeSection === 'advisors' && 'Faculty Advisors'}
              {activeSection === 'assignments' && 'Country Assignments'}
            </h1>
            <p className="text-gray-600">
              {activeSection === 'application' && 'Complete your delegation application'}
              {activeSection === 'delegates' && 'Register your delegation members'}
              {activeSection === 'advisors' && 'Add faculty advisor information'}
              {activeSection === 'assignments' && 'View your country assignments'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            {formData.status === 'pending' ? (
              <Clock className="w-4 h-4 text-yellow-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
            <span className="text-sm font-medium capitalize">{formData.status}</span>
          </div>
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
