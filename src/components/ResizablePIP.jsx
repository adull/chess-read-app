import { useState, useRef } from "react";
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

    const ratio = initialWidth / initialHeight

    const handleResize = (e, data) => {
        let { width, height } = data.size;
    
          width = height * ratio;
    
        setSize({ width, height });
      };
    

    const myRef = useRef(null)

        return (
            <Draggable className="" nodeRef={myRef} cancel=".react-resizable-handle">
                <div ref={myRef} className="absolute border b-1 l-0 t-0">
                <ResizableBox
                    width={size.width}
                    height={size.height}
                    minConstraints={minConstraints}
                    maxConstraints={maxConstraints}
                    // update state on resize
                    onResize={(e, data) => {
                        handleResize(e,data)
                    }}
                >
                     <div className="w-full h-full">
                     {children}
                     </div>
                </ResizableBox>
                </div>
            </Draggable>
            
        )
      
      
}

export default ResizablePIP;