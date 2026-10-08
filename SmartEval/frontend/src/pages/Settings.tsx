import { User, Mail, Shield, Zap, Bell } from "lucide-react"

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-2 text-sm">Manage your account profile and AI evaluation preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" /> Profile Settings
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="Teacher Demo" 
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white" 
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  defaultValue="teacher@smarteval.com" 
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white" 
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-indigo-50/30">
          <h2 className="font-bold text-indigo-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" /> AI Evaluation Settings
          </h2>
        </div>
        <div className="p-6 divide-y divide-gray-100">
          <div className="flex items-center justify-between pb-6">
            <div className="pr-8">
              <p className="font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" /> Strict Grading Mode
              </p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Apply rigorous deductions for incomplete answers, messy handwriting, and spelling mistakes.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between pt-6">
            <div className="pr-8">
              <p className="font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-400" /> Auto-publish Results
              </p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Automatically make results available to students immediately after AI evaluation is completed.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
