export const MoveButton = ({ move, onClick, children }) => (
  
  <button
    onClick={onClick}
    className={`p-2 text-left rounded font-roboto`}
  >
    {children}
  </button>
);


