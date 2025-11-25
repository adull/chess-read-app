export const MoveButton = ({ move,isProblem,  onClick, children }) => (
  
  <button
    onClick={onClick}
    className={`p-2 text-left rounded font-roboto ${isProblem ? `bg-red-400` : ``}`}
  >
    {children}
  </button>
);


