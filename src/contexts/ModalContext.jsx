import React, { useState, createContext, useContext } from 'react';
import { v4 as uuidv4 } from "uuid";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modals, setModals] = useState([]);

    const openModal = (component, name, options = {}) => {
        const id = uuidv4();
        const newModal = { 
            id, 
            name, 
            component, 
            options: {
                size: 'large', // small, medium, large, fullscreen
                ...options
            }
        };
        setModals((prev) => [...prev, newModal]);
        return id;
    };

    const closeModal = (id) => {
        setModals((prev) => prev.filter((m) => m.id !== id));
    };

    const findModal = (name) => {
        return modals.find(item => item.name === name);
    };

    const toggleModal = (component, name, options = {}) => {
        const existingModal = findModal(name);
        if (existingModal) {
            closeModal(existingModal.id);
        } else {
            openModal(component, name, options);
        }
    };

    const getSizeClasses = (size) => {
        switch (size) {
            case 'small':
                return 'max-w-md';
            case 'medium':
                return 'max-w-2xl';
            case 'large':
                return 'max-w-6xl';
            case 'fullscreen':
                return 'max-w-full h-full';
            default:
                return 'max-w-6xl';
        }
    };

    return (
        <ModalContext.Provider value={{ modals, openModal, closeModal, findModal, toggleModal }}>
            {children}
            {modals.map((modal) => (
                <div
                    key={modal.id}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal(modal.id);
                        }
                    }}
                >
                    <div
                        className={`bg-white rounded-lg shadow-xl w-full mx-4 my-4 ${getSizeClasses(modal.options.size)}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <modal.component 
                                {...modal.options} 
                                onClose={() => closeModal(modal.id)} 
                            />
                        </div>
                    </div>
                </div>
            ))}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
