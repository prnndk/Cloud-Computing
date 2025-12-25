import { Edit2, Trash2, Calendar, MoreVertical, CheckCircle, Clock, XCircle, PlayCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const priorityColors = {
    URGENT: 'priority-urgent',
    HIGH: 'priority-high',
    MEDIUM: 'priority-medium',
    LOW: 'priority-low'
}

const statusColors = {
    PENDING: 'status-pending',
    IN_PROGRESS: 'status-in-progress',
    COMPLETED: 'status-completed',
    CANCELLED: 'status-cancelled'
}

const statusLabels = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
}

const priorityLabels = {
    URGENT: 'Urgent',
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low'
}

function TaskList({ tasks, onEdit, onDelete, onUpdateStatus, filter }) {
    const formatDate = (dateString) => {
        if (!dateString) return null
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const isOverdue = (dueDate) => {
        if (!dueDate) return false
        return new Date(dueDate) < new Date() &&
            !['COMPLETED', 'CANCELLED'].includes(tasks.find(t => t.dueDate === dueDate)?.status)
    }

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4">
                    <Clock className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No tasks found</h3>
                <p className="text-sm text-muted-foreground">
                    {filter !== 'ALL'
                        ? `No ${statusLabels[filter]?.toLowerCase()} tasks. Try a different filter.`
                        : 'Create your first task to get started!'
                    }
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task, index) => (
                <Card
                    key={task.id}
                    className="relative overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    {/* Priority indicator */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${priorityColors[task.priority]}`} />

                    <CardContent className="p-5 pt-6">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-2">
                                <Badge className={`${statusColors[task.status]} border-0 text-white text-xs`}>
                                    {statusLabels[task.status]}
                                </Badge>
                                <Badge className={`${priorityColors[task.priority]} border-0 text-white text-xs`}>
                                    {priorityLabels[task.priority]}
                                </Badge>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => onEdit(task)}
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete "{task.title}"? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => onDelete(task.id)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>

                        <h3 className={`font-semibold text-lg mb-2 ${task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                        </h3>

                        {task.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        {task.dueDate && (
                            <div className={`flex items-center gap-1.5 text-xs mb-4 ${isOverdue(task.dueDate) ? 'text-red-400' : 'text-muted-foreground'
                                }`}>
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Due: {formatDate(task.dueDate)}</span>
                                {isOverdue(task.dueDate) && <span className="font-semibold">(Overdue)</span>}
                            </div>
                        )}

                        {/* Quick status change */}
                        <div className="flex gap-2 pt-3 border-t border-slate-700/50">
                            {task.status !== 'COMPLETED' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 text-emerald-400 hover:bg-emerald-400/10"
                                    onClick={() => onUpdateStatus(task.id, 'COMPLETED')}
                                >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Complete
                                </Button>
                            )}
                            {task.status === 'PENDING' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 text-amber-400 hover:bg-amber-400/10"
                                    onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
                                >
                                    <PlayCircle className="w-4 h-4 mr-1" />
                                    Start
                                </Button>
                            )}
                            {task.status === 'IN_PROGRESS' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 text-indigo-400 hover:bg-indigo-400/10"
                                    onClick={() => onUpdateStatus(task.id, 'PENDING')}
                                >
                                    <Clock className="w-4 h-4 mr-1" />
                                    Pause
                                </Button>
                            )}
                            {task.status !== 'CANCELLED' && task.status !== 'COMPLETED' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-400 hover:bg-slate-400/10"
                                    onClick={() => onUpdateStatus(task.id, 'CANCELLED')}
                                >
                                    <XCircle className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default TaskList
