
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ResponsiveBar } from "@nivo/bar"
import { Button } from "@/components/ui/button"

export function Velocity() {
  return (
    <div className="bg-white flex-col w-[200lvw] p-6 rounded-lg shadow-lg max-w-6xl mx-auto my-8">
      <div className="flex justify-between items-start">
        <div className="flex space-x-4 items-center">
          <ArrowLeftIcon className="text-purple-500" />
          <h1 className="text-2xl font-semibold">Velocity</h1>
        </div>
        <PanelTopCloseIcon className="cursor-pointer" />
      </div>
      <p className="text-sm text-gray-600 mt-2">Total amount of work done in two or more sprints.</p>
      <div className="flex mt-6 gap-8">
        <div className="w-1/3 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sprint source</label>
            <Select>
              <SelectTrigger id="sprint-source">
                <SelectValue placeholder="Goal" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="goal">Goal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Goals</label>
            <Select>
              <SelectTrigger id="goals">
                <SelectValue placeholder="4 sprints" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="2-sprints">2 sprints</SelectItem>
                <SelectItem value="4-sprints">4 sprints</SelectItem>
                <SelectItem value="6-sprints">6 sprints</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Input className="w-1/2" placeholder="10/1/19" />
            <Input className="w-1/2" placeholder="11/10/19" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount of work</label>
            <Select>
              <SelectTrigger id="amount-of-work">
                <SelectValue placeholder="Number of tasks" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="tasks">Number of tasks</SelectItem>
                <SelectItem value="hours">Number of hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="estimated-work" />
            <Label htmlFor="estimated-work">Show estimated vs actual work</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch defaultChecked id="subtasks" />
            <Label htmlFor="subtasks">Include subtasks</Label>
          </div>
        </div>
        <div className="w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Sprints</h2>
            <SettingsIcon className="text-gray-400" />
          </div>
          <BarChart className="w-full h-[300px]" />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button className="bg-purple-500 text-white">Add Widget</Button>
      </div>
    </div>
  )
}


function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}


function PanelTopCloseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <path d="m9 16 3-3 3 3" />
    </svg>
  )
}


function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function BarChart(props) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={[
          { name: "Jan", count: 111 },
          { name: "Feb", count: 157 },
          { name: "Mar", count: 129 },
          { name: "Apr", count: 150 },
          { name: "May", count: 119 },
          { name: "Jun", count: 72 },
        ]}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#7c3aed"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  )
}
