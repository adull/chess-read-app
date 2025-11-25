import { useState, useRef, useLayoutEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"

const ResizablePIP = ({ 
    children, 
    width: initialWidth,
    height: initialHeight,
    minConstraints = [300, 300], 
    maxConstraints = [800, 800] 
}) => {
    
    const [size, setSize] = useState({
        width: initialWidth,
        height: initialHeight
    });
    const [hovered, setHovered] = useState(false)
    const [dragging, setDragging] = useState(false)
    // const [instanceKey, setInstanceKey] = useState(0)
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [initialPosition, setInitialPosition] = useState(null);

    const ratio = initialWidth / initialHeight

    const handleResize = (e, data) => {
        let { width, height } = data.size
        width = height * ratio
        setSize({ width, height })
    }

    const handleReset = (e) => {
        e.stopPropagation()
        setSize({ width: initialWidth, height: initialHeight })
        // setInstanceKey((k) => k + 1)
        if (initialPosition) {
            setPosition({ ...initialPosition });
          }
    }

    useLayoutEffect(() => {
        if (myRef.current) {
          const rect = myRef.current.getBoundingClientRect()
          const x = rect.left
          const y = rect.top
    
          console.log({ x, y})
          setPosition({ x: 0, y: 0 })
          setInitialPosition({ x: 0, y: 0 })
        }
      }, []);
    
    

    const myRef = useRef(null)

        return (
            <Draggable className="" nodeRef={myRef} cancel=".react-resizable-handle"
                onStart={() => setDragging(true)}
                onStop={() => setDragging(false)}
                onDrag={(e, data) => {
                    setPosition({ x: data.x, y: data.y });
                  }}
                position={position}
            >
                <div ref={myRef} className="absolute l-0 t-0"
                style={{
                    cursor: dragging ? "grabbing" : "grab",
                  }}>
                <ResizableBox
                    width={size.width}
                    height={size.height}
                    minConstraints={minConstraints}
                    maxConstraints={maxConstraints}
                    onResize={(e, data) => {
                        handleResize(e,data)
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                     <div className="relative w-full h-full">
                        {hovered && (
                        <button
                            type="button"
                            className="cursor-pointer pip-reset-btn absolute -top-2 -right-2 w-6 h-6 rounded-full border bg-white/80 text-xs flex items-center justify-center shadow"
                            onClick={handleReset}
                        >
                            ×
                        </button>
                        )}
                        {children}
                     </div>
                </ResizableBox>
                </div>
            </Draggable>
            
        )
      
      
}

export default ResizablePIP;