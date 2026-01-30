import {
  Globe,
  FileText,
  UserPlus,
  Briefcase,
  X,
  AlertCircle,
  SettingsIcon,
  CheckCircle2,
} from 'lucide-react'
import Image from 'next/image'

type SidebarProps = {
  status: string
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ status, isOpen, onClose, activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'application', label: 'Application', icon: FileText },
    { id: 'delegates', label: 'Add Delegates', icon: UserPlus, requiresApproval: true },
    { id: 'advisors', label: 'Faculty Advisors', icon: Briefcase, requiresApproval: true },
    { id: 'assignments', label: 'Country Assignments', icon: Globe, requiresApproval: true },
    { id: 'account', label: 'Account Settings', icon: SettingsIcon },
  ]

  const isApproved = status === 'approved'

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-transform duration-300 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-72 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex md:hidden items-center gap-3">
              <Image
                src="/logos/bluelogo.png"
                alt="GLUNS Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badge */}
          {isApproved ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700">
              <div className="w-2 h-2 bg-[#85c226] rounded-full"></div>
              Approved
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-sm font-medium text-amber-700">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Pending Review
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6 md:space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isDisabled = item.requiresApproval && !isApproved
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isDisabled) {
                      onSectionChange(item.id)
                      onClose()
                    }
                  }}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#104179] text-white'
                      : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <span className="text-sm font-medium block">{item.label}</span>
                    {isDisabled && <span className="text-xs text-gray-400">Requires approval</span>}
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 bg-[#85c226] rounded-full"></div>}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Status Notice */}
        {!isApproved ? (
          <div className="p-4 m-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Application Under Review
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Additional features will unlock once approved.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 m-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#85c226] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">All Set!</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  All features are now available.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">© {new Date().getFullYear()} GLUNS</p>
        </div>
      </div>
    </>
  )
}
