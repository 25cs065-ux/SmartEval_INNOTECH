import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Button } from "../components/ui/Button"

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and application preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <input type="text" defaultValue="Teacher Demo" className="p-2 border rounded-md max-w-md" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <input type="email" defaultValue="teacher@smarteval.com" className="p-2 border rounded-md max-w-md" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Evaluation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Strict Grading Mode</p>
              <p className="text-sm text-gray-500">Apply rigorous deductions for incomplete answers.</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-publish Results</p>
              <p className="text-sm text-gray-500">Automatically make results available to students after AI evaluation.</p>
            </div>
            <input type="checkbox" className="w-5 h-5 text-primary-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
