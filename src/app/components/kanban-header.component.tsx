import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import {TKanbanInfo} from "../utils/types";


type KanbanHeaderProps = {
    boardInfo: TKanbanInfo;
    onEditClick: () => void;
}
const KanbanHeader: React.FC<KanbanHeaderProps> = ({boardInfo, onEditClick}) => {
    return (
        <header className="header">
            <div className="d-flex align-items-center justify-content-start">
                <h1 className="title">
                    {boardInfo.Name}
                    <EditIcon
                        onClick={onEditClick}
                        className="edit-name"
                        fontSize="large"
                    />
                </h1>
            </div>
            <p className="description">
                {boardInfo.Description}
            </p>
        </header>
    )
}

export default KanbanHeader;