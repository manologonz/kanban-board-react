export interface ITask {
    id: string,
    Title: string,
    Description: string
}

export interface IColumn {
    id: string,
    IsOver: boolean;
    Name: string;
    Tasks: ITask[];
}

export type TaskDragStart = (taskId: string, columnId: string)  => React.DragEventHandler;

export type ColumnDropHandler = (columnId: string) => React.DragEventHandler;

export type ColumnDragEnterHandler = (columnId: string) => React.DragEventHandler;

export type ColumnDragOverHandler = (columnId: string) => React.DragEventHandler;
export type ColumnDragLeaveHandler = (columnId: string) => React.DragEventHandler;

export type GetColumnsFunction = () => IColumn[];

export type GetColumnById = (columnId: string) => IColumn | undefined;

export type GetTaskById = (column: IColumn, taskId: string) => ITask | undefined;

export type DeleteTaskFromColumn = (columnId: IColumn, taskId: string) => IColumn;

export type AddTaskToColumn = (columnId: IColumn, taskId: ITask) => IColumn;

export type UpdateColumns = (column: IColumn[]) => void;

export type TKanbanInfo = {
    Name: string;
    Description: string;
};