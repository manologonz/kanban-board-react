import React from "react";

type KanbanProps = {}

const Kanban: React.FC<KanbanProps> = ({children}) => {
    return (
        <div className="kanban">
            {children}
        </div>
    )
};

export default Kanban;
