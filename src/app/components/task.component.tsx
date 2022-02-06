import React from "react";

type TaksProps = {
    id: string;
    title: string;
    description: string;
    onDragStart: React.DragEventHandler;
    onDragEnter: React.DragEventHandler;
};

const Task: React.FC<TaksProps> = ({ id, title, description, onDragStart, onDragEnter}) => {
    return (
        <div
            id={id}
            draggable={true}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            className="task"
        >
            <section className="header">{title}</section>
            <section className="description">{description}</section>
        </div>
    );
};

export default Task;
