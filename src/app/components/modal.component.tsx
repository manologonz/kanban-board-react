import React from "react";

type ModalType = {
    open: boolean;
}


export const Modal: React.FC<ModalType> = ({children, open}) => {
    return (
        <div className={`custom-modal${!open ? " hidden" : ""}`}>
            <div className="custom-modal__overlay">
                <div className="custom-modal__container">
                    {children}
                </div>
            </div>
        </div>
    );
}

export const ModalHeader: React.FC = ({children}) => {
    return (
        <div className="custom-modal__header">
            {children}
        </div>
    )
}

export const ModalBody: React.FC = ({children}) => {
    return (
        <div className="custom-modal__body">
            {children}
        </div>
    )
}

export const ModalFooter: React.FC = ({children}) => {
    return (
        <div className="custom-modal__footer">
            {children}
        </div>
    )
}


