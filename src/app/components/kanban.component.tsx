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
    TKanbanInfo,
} from "../utils/types";
import _ from "lodash";
import {v4 as uuid} from "uuid";

// Components
import Divider from "./divider.component";
import KanbanBody from "./kanban-body.component";
import KanbanColumn from "./kanban-column.component";
import KanbanContainer from "./kanban-container.component";
import KanbanHeader from "./kanban-header.component";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "./modal.component";
import {Description} from "@mui/icons-material";

type KanbanState = {
    columns: IColumn[];
    ShowModal: boolean;
    ColumnIdInModal?: string;
    TaskFormErrors: {
        Title: string;
        Description: string;
    };
    TaskForm: {Title: string; Description: string};
    ColumnForm: {Name: string};
    ColumnFormErrors: {Name: string};
    KanbanNameForm: {
        Name: string;
        Description: string;
    };
    KanbanNameFormErrors: {
        Name: string;
        Description: string;
    };
    ModalType?: "TASK" | "COLUMN";
    ShowKanbanNameEditModal: boolean;
    KanbanInfo: TKanbanInfo;
};

type KanbanProps = {};

class KanbanBoard extends React.Component<KanbanProps, KanbanState> {
    constructor(props: KanbanProps) {
        super(props);
        const kanbanInfo = this.getKanbanInfo();

        this.state = {
            KanbanInfo: kanbanInfo,
            columns: [],
            ShowModal: false,
            ColumnIdInModal: "",
            TaskForm: {
                Title: "",
                Description: ""
            },
            TaskFormErrors: {
                Title: "",
                Description: ""
            },
            ColumnForm: {
                Name: ""
            },
            ColumnFormErrors: {
                Name: ""
            },
            KanbanNameForm: {
                Name: "",
                Description: ""
            },
            KanbanNameFormErrors: {
                Name: "",
                Description: ""
            },
            ModalType: undefined,
            ShowKanbanNameEditModal: false
        };
    }

    storageKey = "board-data";
    kanbanInfoStorageKey = "kanban-info";

    getColumns: GetColumnsFunction = () => {
        return [...this.state.columns];
    };

    boardHasChange = () => {
        const board = {columns: this.state.columns};
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
        if (column.Tasks.length <= 0) return undefined;

        return column.Tasks.find(({id}) => taskId === id);
    };

    deleteTaskFromColumn: DeleteTaskFromColumn = (column, taskId) => {
        if (column.Tasks.length <= 0) return column;

        const index = column.Tasks.findIndex(({id}) => id === taskId);

        if (index === -1) return column;

        const updatedTasks = column.Tasks.slice();
        updatedTasks.splice(index, 1);

        column.Tasks = [...updatedTasks];

        return column;
    };

    addTaskToColumn: AddTaskToColumn = (column, task) => {
        const exists = column.Tasks.find(({id}) => id === task.id);

        if (exists) return column;

        column.Tasks.push(task);

        return column;
    };

    handleColumnRemove = (id: string, index: number) => {
        let columnsArray = this.state.columns.slice();
        const columnToRemove = columnsArray[index];

        if(!!columnToRemove && columnToRemove.id === id) {
            _.pullAt(columnsArray, index);
            this.setState({columns: columnsArray}, () => {
                this.boardHasChange();
            });
        }
    }

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
                    originalColumn.IsOver = false;
                    destinyColumn.IsOver = false;
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
                        IsOver: true,
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
                        IsOver: false,
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
            const parsedBoardState = JSON.parse(board) as {columns: IColumn[]};

            this.setState(() => {
                return {
                    columns: parsedBoardState.columns,
                };
            });
        }
    };

    handleModalFlag = (open: boolean, columnId?: string, type?: "TASK" | "COLUMN") => {
        if(!open) {
            this.setState({
                ShowModal: false,
                ModalType: undefined,
                ColumnIdInModal: undefined,
                TaskFormErrors: {
                    Title: "",
                    Description: ""
                },
                TaskForm: {
                    Title: "",
                    Description: ""
                },
                ColumnForm: {
                    Name: ""
                },
                ColumnFormErrors: {
                    Name: ""
                }
            });
        } else {
            this.setState({ ColumnIdInModal: columnId, ModalType: type}, () => {
                this.setState({ShowModal: open,});
            });
        }
    }

    handleTaskFormFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({
            TaskForm: {
                ...this.state.TaskForm,
            [e.target.name]: e.target.value
            }
        });
    }

    handleColumnFormFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ColumnForm: {
                ...this.state.ColumnForm,
            [e.target.name]: e.target.value
            }
        });
    }

    handleTaskFormSubmit = () => {
        let valid = true;
        const columnsArray = this.state.columns.slice();
        const columnIndex = _.findIndex(columnsArray, (col: IColumn) => col.id === this.state.ColumnIdInModal);
        const formObj = _.cloneDeep(this.state.TaskForm);
        const errors = {
            Title: "",
            Description: ""
        }

        // Validation
        if(!formObj.Title) {
            errors.Title = "This field is required";
            valid = false;
        }

        if(!formObj.Description) {
            errors.Description = "This field is required";
            valid = false;
        }

        if(valid) {
            if(columnIndex > -1) {
                columnsArray[columnIndex].Tasks.push({
                    id: uuid(),
                    Title: this.state.TaskForm.Title,
                    Description: this.state.TaskForm.Description
                });

                this.setState({
                    columns: columnsArray,
                    ShowModal: false,
                    ColumnIdInModal: undefined,
                    TaskFormErrors: {
                        Title: "",
                        Description: ""
                    },
                    TaskForm: {
                        Title: "",
                        Description: ""
                    }
                }, () => {this.boardHasChange()});
            }
        } else {
            this.setState({
                TaskFormErrors: {
                    ...errors
                }
            });
        }

    }

    handleColumnFormSubmit = () => {
        let valid = true;
        const columnsArray = this.state.columns.slice();
        const formObj = _.cloneDeep(this.state.ColumnForm);
        const errors = {
            Name: "",
        }

        if(!formObj.Name) {
            errors.Name = "This is a required field";
            valid = false;
        }

        if(valid) {
            columnsArray.push({
                id: uuid(),
                IsOver: false,
                Name: this.state.ColumnForm.Name,
                Tasks: []
            });

            this.setState({
                columns: columnsArray,
                ShowModal: false,
                ColumnForm: {
                    Name: ""
                },
                ColumnFormErrors: {
                    Name: ""
                }
            }, () => {this.boardHasChange()});
        } else {
            this.setState({
                ColumnFormErrors: errors
            })
        }
    }

    getKanbanInfo = () => {
       const data = localStorage.getItem(this.kanbanInfoStorageKey);
       if(data) {
           return JSON.parse(data) as TKanbanInfo;
       }

       return {Name: "Kanban Board", Description: "Board default description"};
    }

    handleKanbanNameEditClick = (show: boolean) => {
        this.setState({
            KanbanNameForm: {
                ...this.state.KanbanInfo
            },
        }, () => {
            this.setState({
                ShowKanbanNameEditModal: show
            });
        });
    }

    handleKanbanFormInputChante = (e:  React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        this.setState({
            KanbanNameForm: {
                ...this.state.KanbanNameForm,
                [e.target.name]: e.target.value
            }
        })
    }

    handleKanbanFormSave = () => {
        const formObj = this.state.KanbanNameForm;
        const errorObj = {
            Name: "",
            Description: ""
        }
        let valid = true;

        // validations
        if(!formObj.Name) {
            valid = false;
            errorObj.Name = "This is a required field"
            this.setState({
                KanbanNameFormErrors: errorObj
            });
        }

        if(!formObj.Description) {
            formObj.Description = "";
        }

        if(valid) {
            localStorage.setItem(this.kanbanInfoStorageKey, JSON.stringify(formObj));
            this.setState( {
                KanbanInfo: {
                    Name: formObj.Name,
                    Description: formObj.Description
                },
                ShowKanbanNameEditModal: false
            }, () => {
               this.setState({
                   KanbanNameForm: {
                       Name: "",
                       Description: ""
                   },
                   KanbanNameFormErrors: {
                       Name: "",
                       Description: ""
                   }
               });
            });
        }
    }

    componentDidMount() {
        this.loadBoard();
    }

    render() {
        return (
            <>
                <Modal open={this.state.ShowModal}>
                    <ModalHeader>
                        <p className="modal-title">
                            {
                                this.state.ModalType === "COLUMN"
                                    ? "New Column"
                                    : this.state.ModalType === "TASK"
                                        ? "New task"
                                        : null
                            }
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        {
                            this.state.ModalType === "TASK" ? (
                                <form>
                                    <div className="form-group mb-5 input-container">
                                        <label htmlFor="title">Title</label>
                                        <input
                                            value={this.state.TaskForm.Title}
                                            type="text"
                                            name="Title"
                                            className="form-control"
                                            onChange={this.handleTaskFormFieldChange}
                                        />
                                        {
                                            !!this.state.TaskFormErrors.Title && (
                                                <div className="input-error">
                                                    <p>
                                                        {this.state.TaskFormErrors.Title}
                                                    </p>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="form-group input-container">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            value={this.state.TaskForm.Description}
                                            name="Description"
                                            className="form-control"
                                            onChange={this.handleTaskFormFieldChange}
                                        >
                                        </textarea>
                                        {
                                            !!this.state.TaskFormErrors.Description && (
                                                <div className="input-error">
                                                    <p>
                                                        {this.state.TaskFormErrors.Description}
                                                    </p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </form>
                            ) : this.state.ModalType === "COLUMN" ? (
                                    <form>
                                        <div className="form-group mb-5 input-container">
                                            <label htmlFor="title">Name</label>
                                            <input
                                                value={this.state.ColumnForm.Name}
                                                type="text"
                                                name="Name"
                                                className="form-control"
                                                onChange={this.handleColumnFormFieldChange}
                                            />
                                            {
                                                !!this.state.ColumnFormErrors.Name && (
                                                    <div className="input-error">
                                                        <p>
                                                            {this.state.ColumnFormErrors.Name}
                                                        </p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </form>
                                ) : null
                        }
                    </ModalBody>
                    <ModalFooter>
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-primary"
                                style={{marginRight: "10px"}}
                                onClick={() => {
                                    if(this.state.ModalType === "TASK") {
                                        this.handleTaskFormSubmit()
                                    } else if(this.state.ModalType === "COLUMN") {
                                        this.handleColumnFormSubmit();
                                    }
                                }}
                             >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    this.handleModalFlag(false)
                                }}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </ModalFooter>
                </Modal>
                <Modal open={this.state.ShowKanbanNameEditModal}>
                    <ModalHeader>
                        <p className="modal-title">
                            Edit kanban
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <form>
                            <div className="form-group mb-5 input-container">
                                <label htmlFor="Name">Name</label>
                                <input
                                    className="form-control"
                                    onChange={this.handleKanbanFormInputChante}
                                    type="text"
                                    name="Name"
                                    value={this.state.KanbanNameForm.Name}
                                />
                                {
                                    !!this.state.KanbanNameFormErrors.Name && (
                                        <div className="input-error">
                                            <p>
                                                {this.state.KanbanNameFormErrors.Name}
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="form-group mb-5 input-container">
                                <label htmlFor="Description">Description</label>
                                <textarea
                                    onChange={this.handleKanbanFormInputChante}
                                    maxLength={100}
                                    rows={10}
                                    name="Description"
                                    value={this.state.KanbanNameForm.Description}
                                >
                                </textarea>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                         <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-primary"
                                style={{marginRight: "10px"}}
                                onClick={this.handleKanbanFormSave}
                             >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    this.handleKanbanNameEditClick(false)
                                }}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </ModalFooter>
                </Modal>
                <KanbanContainer>
                    <KanbanHeader
                        onEditClick={() => {this.handleKanbanNameEditClick(true)}}
                        boardInfo={this.state.KanbanInfo}
                    />
                    <Divider/>
                    <KanbanBody>
                        {this.state.columns.map((column, index) => {
                            return (
                                <KanbanColumn
                                    key={column.id}
                                    index={index}
                                    handleColumnDrop={this.handleColumnDrop}
                                    onRemoveColumnClick={this.handleColumnRemove}
                                    handleColumnDragOver={this.handleColumnDragOver}
                                    handleColumnEnter={this.handleColumnEnter}
                                    handleColumnLeave={this.handleColumLeave}
                                    onAddTaskButtonClick={this.handleModalFlag}
                                    {...column}
                                />
                            );
                        })}
                        <div className="add-column-button-container">
                            <AddBoxIcon
                                onClick={() => {this.handleModalFlag(true, undefined, "COLUMN")}}
                                fontSize="large"
                            />
                        </div>
                    </KanbanBody>
                </KanbanContainer>
            </>
        );
    }
}

export default KanbanBoard;
