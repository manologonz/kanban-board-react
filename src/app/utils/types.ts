export interface ITask {
    id: string,
    title: string,
    description: string
}

export interface IColumn {
    id: string,
    name: string;
    tasks: ITask[];
}

export type TaskDragStart = (taskId: string, columnId: string)  => React.DragEventHandler;

export type ColumnDropHandler = (columnId: string) => React.DragEventHandler;

export type GetColumnsFunction = () => IColumn[];

export type GetColumnById = (columnId: string) => IColumn | undefined;

export type GetTaskById = (column: IColumn, taskId: string) => ITask | undefined;

export type DeleteTaskFromColumn = (columnId: IColumn, taskId: string) => IColumn;

export type AddTaskToColumn = (columnId: IColumn, taskId: ITask) => IColumn;

export type UpdateColumns = (column: IColumn[]) => void;
