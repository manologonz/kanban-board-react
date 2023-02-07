import React, {useState} from 'react';
import {MoreVert} from "@mui/icons-material";

const ColumnOptions: React.FC = ({children}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="column-options-menu">
            <MoreVert onClick={() => setOpen(!open)} className="column-options-menu__more-icon"/>
            {
                open && (
                    <div className="column-options-menu__options-container">
                        <ul className="column-options-menu__potions-container--list">
                            {children}
                        </ul>
                    </div>
                )
            }
        </div>
    );
};

type MenuOptionProps = {
    onClick: (event: React.MouseEvent) => void
}
export const MenuOption: React.FC<MenuOptionProps> = ({children, onClick}) => {
    return (
       <li
           onClick={onClick}
           className="column-options-menu__potions-container--list__option"
       >
           {children}
       </li>
    );
}

export default ColumnOptions;
