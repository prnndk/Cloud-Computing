import { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Clock, AlertCircle, ListTodo, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TaskList from '@/components/TaskList'
import TaskForm from '@/components/TaskForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const API_URL = '/api'

function App() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [filter, setFilter] = useState('ALL')

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/tasks`)
            if (!response.ok) throw new Error('Failed to fetch tasks')
            const data = await response.json()
            setTasks(data)
            setError(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    // Create task
    const handleCreateTask = async (taskData) => {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            })
            if (!response.ok) throw new Error('Failed to create task')
            await fetchTasks()
            setIsFormOpen(false)
        } catch (err) {
            setError(err.message)
        }
    }

    // Update task
    const handleUpdateTask = async (id, taskData) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            })
            if (!response.ok) throw new Error('Failed to update task')
            await fetchTasks()
            setIsFormOpen(false)
            setEditingTask(null)
        } catch (err) {
            setError(err.message)
        }
    }

    // Delete task
    const handleDeleteTask = async (id) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete task')
            await fetchTasks()
        } catch (err) {
            setError(err.message)
        }
    }

    // Update status
    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (!response.ok) throw new Error('Failed to update status')
            await fetchTasks()
        } catch (err) {
            setError(err.message)
        }
    }

    // Filter tasks
    const filteredTasks = filter === 'ALL'
        ? tasks
        : tasks.filter(task => task.status === filter)

    // Stats
    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'PENDING').length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        completed: tasks.filter(t => t.status === 'COMPLETED').length
    }

    const openEditForm = (task) => {
        setEditingTask(task)
        setIsFormOpen(true)
    }

    const closeForm = () => {
        setIsFormOpen(false)
        setEditingTask(null)
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-card border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <ListTodo className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold gradient-text">Task Manager</h1>
                                <p className="text-xs text-muted-foreground">Cloud Computing Case 5</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={fetchTasks}
                                disabled={loading}
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                            <Dialog open={isFormOpen} onOpenChange={(open) => {
                                if (!open) closeForm()
                                else setIsFormOpen(true)
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="glow">
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Task
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle className="gradient-text">
                                            {editingTask ? 'Edit Task' : 'Create New Task'}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <TaskForm
                                        task={editingTask}
                                        onSubmit={editingTask
                                            ? (data) => handleUpdateTask(editingTask.id, data)
                                            : handleCreateTask
                                        }
                                        onCancel={closeForm}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card
                        className={`cursor-pointer transition-all hover:scale-105 ${filter === 'ALL' ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setFilter('ALL')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <ListTodo className="w-5 h-5 text-blue-400" />
                                <span className="text-2xl font-bold">{stats.total}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all hover:scale-105 ${filter === 'PENDING' ? 'ring-2 ring-indigo-500' : ''}`}
                        onClick={() => setFilter('PENDING')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-indigo-400" />
                                <span className="text-2xl font-bold">{stats.pending}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all hover:scale-105 ${filter === 'IN_PROGRESS' ? 'ring-2 ring-amber-500' : ''}`}
                        onClick={() => setFilter('IN_PROGRESS')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-400" />
                                <span className="text-2xl font-bold">{stats.inProgress}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all hover:scale-105 ${filter === 'COMPLETED' ? 'ring-2 ring-emerald-500' : ''}`}
                        onClick={() => setFilter('COMPLETED')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span className="text-2xl font-bold">{stats.completed}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 animate-fade-in">
                        <p className="font-medium">Error: {error}</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setError(null)}
                            className="mt-2 text-red-400 hover:text-red-300"
                        >
                            Dismiss
                        </Button>
                    </div>
                )}

                {/* Task List */}
                {loading && tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-4" />
                        <p className="text-muted-foreground">Loading tasks...</p>
                    </div>
                ) : (
                    <TaskList
                        tasks={filteredTasks}
                        onEdit={openEditForm}
                        onDelete={handleDeleteTask}
                        onUpdateStatus={handleUpdateStatus}
                        filter={filter}
                    />
                )}
            </main>

            {/* Footer */}
            <footer className="border-t glass-card mt-auto">
                <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
                    <p>Task Manager &copy; 2024 - Cloud Computing Case 5</p>
                    <p className="text-xs mt-1">Built with React, Express, Prisma, MySQL, and Docker</p>
                </div>
            </footer>
        </div>
    )
}

export default App
