import React from "react";
import { ITask, TaskDragStart, ColumnDropHandler, ColumnDragEnterHandler, ColumnDragOverHandler, ColumnDragLeaveHandler} from "../utils/types";
import Task from "./task.component";

type KanbanColumnProps = {
    id: string;
    name: string;
    tasks: ITask[];
    handleColumnDrop: ColumnDropHandler;
    handleColumnDragOver: ColumnDragOverHandler;
    handleColumnEnter: ColumnDragEnterHandler;
    handleColumnLeave: ColumnDragLeaveHandler
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
        isOver
    } = props;

    const handleDragStart: TaskDragStart = (taskId, columnId) => {
        return (event) => {
            event.dataTransfer.setData("taskId", taskId);
            event.dataTransfer.setData("originalColumn", columnId);
        }
    }

    return (
        <div className={`column${isOver ? " is-drag-over" : ""}`}>
            <header>{name}</header>
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
