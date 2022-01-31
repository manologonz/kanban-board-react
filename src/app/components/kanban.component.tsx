import React from "react";
import Divider from "./divider.component";
import KanbanBody from "./kanban-body.component";
import KanbanColumn from "./kanban-column.component";
import KanbanContainer from "./kanban-container.component";
import KanbanHeader from "./kanban-header.component";

const KanbanBoard = () => {
    return (
        <KanbanContainer>
            <KanbanHeader />
            <Divider />
            <KanbanBody>
                <KanbanColumn />
                <KanbanColumn />
                <KanbanColumn />
            </KanbanBody>
        </KanbanContainer>
    );
};

export default KanbanBoard;
