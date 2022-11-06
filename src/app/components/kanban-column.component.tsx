import React from "react";

// Components
import {
    ITask,
    TaskDragStart,
    ColumnDropHandler,
    ColumnDragEnterHandler,
    ColumnDragOverHandler,
    ColumnDragLeaveHandler
} from "../utils/types";
import Task from "./task.component";

// Icons
import AddBoxIcon from '@mui/icons-material/AddBox';

type KanbanColumnProps = {
    id: string;
    name: string;
    tasks: ITask[];
    handleColumnDrop: ColumnDropHandler;
    handleColumnDragOver: ColumnDragOverHandler;
    handleColumnEnter: ColumnDragEnterHandler;
    handleColumnLeave: ColumnDragLeaveHandler
    handleAddTask: (open: boolean) => void
    isOver: boolean
};

const KanbanColumn: React.FC<KanbanColumnProps> = (props) => {
    const {
        id,
        name,
        tasks,
        handleColumnDrop,
        handleColumnDragOver,
        handleColumnEnter,
        handleColumnLeave,
        isOver,
        handleAddTask
    } = props;

    const handleDragStart: TaskDragStart = (taskId, columnId) => {
        return (event) => {
            event.dataTransfer.setData("taskId", taskId);
            event.dataTransfer.setData("originalColumn", columnId);
        }
    }

    return (
        <div className={`column${isOver ? " is-drag-over" : ""}`}>
            <header>
                <div className="far-away">
                    {name}
                    <AddBoxIcon className="add-task-button" onClick={() => {handleAddTask(true)}}/>
                </div>
            </header>
            <div
                id={id}
                onDrop={handleColumnDrop(id)}
                onDragOver={handleColumnDragOver(id)}
                onDragLeave={handleColumnLeave(id)}
                className={`task-list`}
            >
                {tasks.map((task) => {
                    return (
                        <Task
                            key={task.id}
                            onDragStart={handleDragStart(task.id, id)}
                            onDragEnter={handleColumnEnter(id)}
                            {...task}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default KanbanColumn;
