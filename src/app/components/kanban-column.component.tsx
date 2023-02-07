import React, {useState} from "react";

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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import {IconButton} from "@mui/material";
import {MoreVert} from "@mui/icons-material";

type KanbanColumnProps = {
    id: string;
    index: number;
    Name: string;
    Tasks: ITask[];
    handleColumnDrop: ColumnDropHandler;
    handleColumnDragOver: ColumnDragOverHandler;
    handleColumnEnter: ColumnDragEnterHandler;
    handleColumnLeave: ColumnDragLeaveHandler;
    onAddTaskButtonClick: (open: boolean, columnId: string, type?: "COLUMN" | "TASK") => void;
    onRemoveColumnClick: (id: string, index: number) => void;
    IsOver: boolean;
};

const KanbanColumn: React.FC<KanbanColumnProps> = (props) => {
    const {
        id,
        index,
        Name,
        Tasks,
        handleColumnDrop,
        handleColumnDragOver,
        handleColumnEnter,
        handleColumnLeave,
        IsOver,
        onAddTaskButtonClick,
        onRemoveColumnClick
    } = props;

    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setMenuAnchor(null);
    };

    const handleDragStart: TaskDragStart = (taskId, columnId) => {
        return (event) => {
            event.dataTransfer.setData("taskId", taskId);
            event.dataTransfer.setData("originalColumn", columnId);
        }
    }

    return (
        <div className={`column${IsOver ? " is-drag-over" : ""}`}>
            <header>
                <div className="far-away">
                    {Name}
                    <div className="d-flex align-items-center justify-content-center">
                        <IconButton
                            aria-label="column-options"
                            id="column-options-button"
                            arial-controls={!!menuAnchor ? 'menu-options' : undefined}
                            arial-expanded={!!menuAnchor ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreVert/>
                        </IconButton>
                        <Menu
                            id="menu-options"
                            MenuListProps={{
                                'aria-labelledby': 'column-options-button'
                            }}
                            anchorEl={menuAnchor}
                            open={!!menuAnchor}
                            onClose={handleClose}
                        >
                            <MenuItem
                                onClick={() => {
                                    onAddTaskButtonClick(true, id, "TASK");
                                    handleClose();
                                }}
                            >
                               Add task
                            </MenuItem>
                            <MenuItem
                                style={{color: "red"}}
                                onClick={() => {
                                    onRemoveColumnClick(id, index);
                                    handleClose()
                                }}
                            >
                               Remove Column
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </header>
            <div
                id={id}
                onDrop={handleColumnDrop(id)}
                onDragOver={handleColumnDragOver(id)}
                onDragLeave={handleColumnLeave(id)}
                className={`task-list`}
            >
                {Tasks.map((task) => {
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
