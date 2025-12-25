import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

function TaskForm({ task, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: ''
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'MEDIUM',
                status: task.status || 'PENDING',
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
            })
        }
    }, [task])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title.trim()) return

        setLoading(true)
        try {
            await onSubmit({
                ...formData,
                dueDate: formData.dueDate || null
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="Enter task title..."
                    value={formData.title}
                    onChange={handleChange}
                    required
                    autoFocus
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter task description..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                        value={formData.priority}
                        onValueChange={(value) => handleSelectChange('priority', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LOW">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Low
                                </span>
                            </SelectItem>
                            <SelectItem value="MEDIUM">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                    Medium
                                </span>
                            </SelectItem>
                            <SelectItem value="HIGH">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                    High
                                </span>
                            </SelectItem>
                            <SelectItem value="URGENT">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    Urgent
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {task && (
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleSelectChange('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                        Pending
                                    </span>
                                </SelectItem>
                                <SelectItem value="IN_PROGRESS">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                        In Progress
                                    </span>
                                </SelectItem>
                                <SelectItem value="COMPLETED">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Completed
                                    </span>
                                </SelectItem>
                                <SelectItem value="CANCELLED">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                                        Cancelled
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {!task && <div></div>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading || !formData.title.trim()}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {task ? 'Update Task' : 'Create Task'}
                </Button>
            </div>
        </form>
    )
}

export default TaskForm
