import React from "react";
// Utils
import {
    IColumn,
    ColumnDropHandler,
    GetColumnsFunction,
    GetColumnById,
    GetTaskById,
    DeleteTaskFromColumn,
    AddTaskToColumn,
    UpdateColumns,
    ColumnDragEnterHandler,
    ColumnDragOverHandler,
    ColumnDragLeaveHandler,
} from "../utils/types";

// Components
import Divider from "./divider.component";
import KanbanBody from "./kanban-body.component";
import KanbanColumn from "./kanban-column.component";
import KanbanContainer from "./kanban-container.component";
import KanbanHeader from "./kanban-header.component";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "./modal.component";

type KanbanState = {
    columns: IColumn[];
    showAddTaskModal: boolean;
};
type KanbanProps = {};

class KanbanBoard extends React.Component<KanbanProps, KanbanState> {
    constructor(props: KanbanProps) {
        super(props);
        this.state = {
            columns: [],
            showAddTaskModal: false
        };
    }

    storageKey = "board-data";

    getColumns: GetColumnsFunction = () => {
        return [...this.state.columns];
    };

    boardHasChange = () => {
        const board = this.state;
        localStorage.setItem(this.storageKey, JSON.stringify(board));
    };

    getColumnById: GetColumnById = (columnId) => {
        const columns = this.getColumns();

        if (columns.length <= 0) {
            return undefined;
        }

        return columns.find(({id}) => id === columnId);
    };

    getTaskById: GetTaskById = (column, taskId) => {
        if (column.tasks.length <= 0) return undefined;

        return column.tasks.find(({id}) => taskId === id);
    };

    deleteTaskFromColumn: DeleteTaskFromColumn = (column, taskId) => {
        if (column.tasks.length <= 0) return column;

        const index = column.tasks.findIndex(({id}) => id === taskId);

        if (index === -1) return column;

        const updatedTasks = column.tasks.slice();
        updatedTasks.splice(index, 1);

        column.tasks = [...updatedTasks];

        return column;
    };

    addTaskToColumn: AddTaskToColumn = (column, task) => {
        const exists = column.tasks.find(({id}) => id === task.id);

        if (exists) return column;

        column.tasks.push(task);

        return column;
    };

    updateColumns: UpdateColumns = (updatedColumns) => {
        const stateColumns = this.getColumns();

        updatedColumns.forEach((column) => {
            const index = stateColumns.findIndex(({id}) => column.id === id);

            if (index > -1) {
                stateColumns[index] = column;
            }
        });

        this.setState(
            () => ({columns: stateColumns}),
            () => {
                this.boardHasChange();
            }
        );
    };

    handleColumnDrop: ColumnDropHandler = (columnId) => {
        return (event) => {
            event.preventDefault();
            const dragedTaskId = event.dataTransfer.getData("taskId");
            let originalColumn = this.getColumnById(
                event.dataTransfer.getData("originalColumn")
            );
            let destinyColumn = this.getColumnById(columnId);

            if (originalColumn && destinyColumn) {
                const dragedTask = this.getTaskById(
                    originalColumn,
                    dragedTaskId
                );
                if (dragedTask) {
                    originalColumn = this.deleteTaskFromColumn(
                        originalColumn,
                        dragedTask.id
                    );
                    destinyColumn = this.addTaskToColumn(
                        destinyColumn,
                        dragedTask
                    );
                    originalColumn.isOver = false;
                    destinyColumn.isOver = false;
                    this.updateColumns([originalColumn, destinyColumn]);
                }
            }
        };
    };

    handleColumnDragOver: ColumnDragOverHandler = (columnId) => {
        return (event) => {
            event.preventDefault();
            let columns = this.getColumns();
            columns = columns.map<IColumn>((column) => {
                if (column.id === columnId) {
                    return {
                        ...column,
                        isOver: true,
                    };
                }
                return {
                    ...column,
                };
            });

            this.setState(() => ({columns}));
        };
    };

    handleColumnEnter: ColumnDragEnterHandler = (columnId) => {
        return (event) => {
            event.preventDefault();
        };
    };

    handleColumLeave: ColumnDragLeaveHandler = (columnId) => {
        return (event) => {
            event.preventDefault();
            let columns = this.getColumns();
            columns = columns.map<IColumn>((column) => {
                if (column.id === columnId) {
                    return {
                        ...column,
                        isOver: false,
                    };
                }
                return {
                    ...column,
                };
            });

            this.setState(() => ({columns}));
        };
    };

    loadBoard = () => {
        const board = localStorage.getItem(this.storageKey);
        if (!!board) {
            const parsedBoardState = JSON.parse(board) as KanbanState;
            this.setState(() => {
                return {
                    columns: parsedBoardState.columns,
                };
            });
        }
    };

    handleAddTask = (open: boolean) => {
        this.setState({showAddTaskModal: open});
    }

    componentDidMount() {
        this.loadBoard();
    }

    render() {
        const columns = this.getColumns();
        return (
            <>
                <Modal open={this.state.showAddTaskModal}>
                    <ModalHeader>
                        <p className="modal-title">New task</p>
                    </ModalHeader>
                    <ModalBody>
                        <form>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input value="something" type="text" name="title" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea name="description" className="form-control">
                                </textarea>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-primary" style={{marginRight: "10px"}}>Save</button>
                            <button onClick={() => {
                                this.handleAddTask(false)
                            }} className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </ModalFooter>
                </Modal>
                <KanbanContainer>
                    <KanbanHeader/>
                    <Divider/>
                    <KanbanBody>
                        {columns.map((column) => {
                            return (
                                <KanbanColumn
                                    key={column.id}
                                    handleColumnDrop={this.handleColumnDrop}
                                    handleColumnDragOver={this.handleColumnDragOver}
                                    handleColumnEnter={this.handleColumnEnter}
                                    handleColumnLeave={this.handleColumLeave}
                                    handleAddTask={this.handleAddTask}
                                    {...column}
                                />
                            );
                        })}
                    </KanbanBody>
                </KanbanContainer>
            </>
        );
    }
}

export default KanbanBoard;
