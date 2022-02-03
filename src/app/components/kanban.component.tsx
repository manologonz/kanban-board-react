import React from "react";
import { v4 as uuid } from "uuid";
import { IColumn, ColumnDropHandler, GetColumnsFunction, GetColumnById, GetTaskById, DeleteTaskFromColumn, AddTaskToColumn, UpdateColumns} from "../utils/types";
import Divider from "./divider.component";
import KanbanBody from "./kanban-body.component";
import KanbanColumn from "./kanban-column.component";
import KanbanContainer from "./kanban-container.component";
import KanbanHeader from "./kanban-header.component";

type KanbanState = {
    columns: IColumn[];
};
type KanbanProps = {};

class KanbanBoard extends React.Component<KanbanProps, KanbanState> {
    constructor(props: KanbanProps) {
        super(props);
        this.state = {
            columns: [
                {
                    id: uuid(),
                    name: "To Do",
                    tasks: [
                        {
                            id: uuid(),
                            title: "First Todo",
                            description: "This is a default task",
                        },
                        {
                            id: uuid(),
                            title: "First Todo",
                            description: "This is a default task",
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Complete",
                    tasks: []
                }
            ],
        };
    }

    getColumns: GetColumnsFunction = () => {
        return [...this.state.columns];
    };

    getColumnById: GetColumnById = (columnId) => {
        const columns = this.getColumns();

        if(columns.length <= 0) {
            return undefined;
        }

        return columns.find(({id}) => id === columnId);
    }

    getTaskById: GetTaskById = (column, taskId) => {
        if(column.tasks.length <= 0) return undefined;

        return column.tasks.find(({id}) => taskId === id);
    }

    deleteTaskFromColumn: DeleteTaskFromColumn = (column, taskId) => {
        if(column.tasks.length <= 0) return column;

        const index = column.tasks.findIndex(({id}) => id === taskId);

        if(index === -1) return column;

        const updatedTasks = column.tasks.slice();
        updatedTasks.splice(index, 1);

        column.tasks = [...updatedTasks];

        return column;
    }

    addTaskToColumn: AddTaskToColumn = (column, task) => {
        const exists = column.tasks.find(({id}) => id === task.id);

        if(exists) return column;

        column.tasks.push(task);

        return column;
    }

    updateColumns: UpdateColumns = (updatedColumns) => {
        const stateColumns = this.getColumns();

        updatedColumns.forEach((column) => {
            const index = stateColumns.findIndex(({id}) => column.id === id);

            if(index > -1) {
                stateColumns[index] = column;
            }
        });

        this.setState(() => ({columns: stateColumns}));
    }

    handleColumnDrop: ColumnDropHandler = (columnId) => {
        return (event) => {
            event.preventDefault();
            const dragedTaskId = event.dataTransfer.getData("taskId");
            let originalColumn = this.getColumnById(event.dataTransfer.getData("originalColumn"));
            let destinyColumn = this.getColumnById(columnId);

            if(originalColumn && destinyColumn) {
                const dragedTask = this.getTaskById(originalColumn, dragedTaskId);

                if(dragedTask) {
                    originalColumn = this.deleteTaskFromColumn(originalColumn, dragedTask.id);
                    destinyColumn = this.addTaskToColumn(destinyColumn, dragedTask);
                    this.updateColumns([
                        originalColumn,
                        destinyColumn
                    ])
                }

            }

        }
    }

    handleColumnDragOver: React.DragEventHandler = (event) => {
        event.preventDefault();
    }

    render() {
        const columns = this.getColumns();
        return (
            <KanbanContainer>
                <KanbanHeader />
                <Divider />
                <KanbanBody>
                    {columns.map((column) => {
                        return <KanbanColumn
                            key={column.id}
                            handleColumnDrop={this.handleColumnDrop}
                            handleColumnDragOver={this.handleColumnDragOver}
                            {...column}
                        />;
                    })}
                </KanbanBody>
            </KanbanContainer>
        );
    }
}

export default KanbanBoard;
