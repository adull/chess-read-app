import React, { useState, createContext, useContext } from 'react';
import { v4 as uuidv4 } from "uuid";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [panels, setPanels] = useState([]);

    const addPanel = (name, component, options = {}) => {
        const id = uuidv4();
        const newPanel = { 
            id, 
            name, 
            component, 
            options: {
                position: 'top-right',
                width: 'w-64',
                ...options
            }
        };
        setPanels((prev) => [...prev, newPanel])
        return id;
    }

    const findPanel = (name) => {
        return panels.find(item => item.name === name)
    }

    const removePanel = (id) => {
        setPanels((prev) => prev.filter((p) => p.id !== id ));
    };

    const togglePanel = (name, component, options = {}) => {
        const existingPanel = findPanel(name);
        if (existingPanel) {
            removePanel(existingPanel.id);
        } else {
            addPanel(name, component, options);
        }
    };

    return (
        <SidebarContext.Provider value={{ panels, addPanel, findPanel, removePanel, togglePanel }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
                {panels.map((p) => (
                <div
                    key={p.id}
                    className={`bg-white/90 backdrop-blur border border-gray-300 shadow-md rounded-xl p-3 ${p.options.width}`}
                >
                    <p.component {...p.options} onClose={() => removePanel(p.id)} />
                </div>
                ))}
            </div>
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => {
    return useContext(SidebarContext);
}