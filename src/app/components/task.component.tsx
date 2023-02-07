import React from "react";

type TaksProps = {
    id: string;
    Title: string;
    Description: string;
    onDragStart: React.DragEventHandler;
    onDragEnter: React.DragEventHandler;
};

const Task: React.FC<TaksProps> = ({ id, Title, Description, onDragStart, onDragEnter}) => {
    return (
        <div
            id={id}
            draggable={true}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            className="task"
        >
            <section className="header">{Title}</section>
            <section className="description">{Description}</section>
        </div>
    );
};

export default Task;
