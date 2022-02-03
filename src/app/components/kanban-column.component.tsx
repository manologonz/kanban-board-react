import React from "react";
import { ITask, TaskDragStart, ColumnDropHandler} from "../utils/types";
import Task from "./task.component";

type KanbanColumnProps = {
    id: string;
    name: string;
    tasks: ITask[];
    handleColumnDrop: ColumnDropHandler;
    handleColumnDragOver: React.DragEventHandler;
};

const KanbanColumn: React.FC<KanbanColumnProps> = (props) => {
    const {
        id,
        name,
        tasks,
        handleColumnDrop,
        handleColumnDragOver,
    } = props;

    const handleDragStart: TaskDragStart = (taskId, columnId) => {
        return (event) => {
            event.dataTransfer.setData("taskId", taskId);
            event.dataTransfer.setData("originalColumn", columnId);
        }
    }

    return (
        <div className="column">
            <header>{name}</header>
            <div
                id={id}
                onDrop={handleColumnDrop(id)}
                onDragOver={handleColumnDragOver}
                className="task-list"
            >
                {tasks.map((task) => {
                    return (
                        <Task
                            key={task.id}
                            onDragStart={handleDragStart(task.id, id)}
                            {...task}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default KanbanColumn;
