import { useState } from 'react';

const MovesEditor = ({ moveList, canEdit, pgnIssue, onChangeMove }) => {
  const [editing, setEditing] = useState(null); // { moveNumber, color } | null
  const [hovered, setHovered] = useState(null); // { moveNumber, color } | null
  const [draftValue, setDraftValue] = useState('');

  const startEdit = (moveNumber, color, currentValue) => {
    setEditing({ moveNumber, color });
    setDraftValue(currentValue || '');
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraftValue('');
  };

  const commitEdit = (moveNumber, color) => {
    const text = draftValue.trim();
    if (onChangeMove && text !== '') {
      onChangeMove({
        moveNumber,
        type: color, // "white" | "black"
        text,
      });
    }
    cancelEdit();
  };

  const renderCell = (move, color) => {
    const value = move[color] || '';
    const isEditing =
      editing &&
      editing.moveNumber === move.moveNumber &&
      editing.color === color;

    const isHovered =
      hovered &&
      hovered.moveNumber === move.moveNumber &&
      hovered.color === color;

    const isIssueCell =
      pgnIssue?.hasIssue &&
      pgnIssue.moveNumber === move.moveNumber &&
      pgnIssue.turn === color;

    const cellStyle = {
      padding: '0.35rem 0.75rem',
      position: 'relative',
      backgroundColor: isIssueCell ? '#ffe5e5' : 'transparent',
      border: isIssueCell ? '1px solid #f87171' : '1px solid #e5e7eb',
      borderRadius: '4px',
    };

    const editButtonStyle = {
      position: 'absolute',
      right: '4px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '0.7rem',
      padding: '0.1rem 0.3rem',
      borderRadius: '3px',
      border: '1px solid #d1d5db',
      background: '#f9fafb',
      cursor: 'pointer',
      opacity: 0.9,
    };

    if (isEditing) {
      return (
        <td style={cellStyle}>
          <input
            autoFocus
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onBlur={() => commitEdit(move.moveNumber, color)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commitEdit(move.moveNumber, color);
              } else if (e.key === 'Escape') {
                cancelEdit();
              }
            }}
            style={{
              width: '100%',
              padding: '0.2rem 0.3rem',
              fontSize: '0.85rem',
              borderRadius: '3px',
              border: '1px solid #d1d5db',
            }}
          />
        </td>
      );
    }

    return (
      <td
        style={cellStyle}
        onMouseEnter={() => setHovered({ moveNumber: move.moveNumber, color })}
        onMouseLeave={() => setHovered(null)}
      >
        <span>{value}</span>
        {canEdit && isHovered && (
          <button
            type="button"
            style={editButtonStyle}
            onClick={() => startEdit(move.moveNumber, color, value)}
          >
            Edit
          </button>
        )}
      </td>
    );
  };

  const rowHasIssue = (move) =>
    pgnIssue?.hasIssue && pgnIssue.moveNumber === move.moveNumber;

  return (
    <div style={{ marginTop: '1rem' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 4px',
          fontSize: '0.9rem',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                padding: '0.5rem 0.75rem',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              Move #
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '0.5rem 0.75rem',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              White
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '0.5rem 0.75rem',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              Black
            </th>
          </tr>
        </thead>
        <tbody>
          {moveList.map((move) => (
            <tr
              key={move.moveNumber}
              style={{
                backgroundColor: rowHasIssue(move) ? '#fef2f2' : '#ffffff',
              }}
            >
              <td
                style={{
                  padding: '0.35rem 0.75rem',
                  color: rowHasIssue(move) ? '#b91c1c' : '#374151',
                  fontWeight: rowHasIssue(move) ? 600 : 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {move.moveNumber}
              </td>
              {renderCell(move, 'white')}
              {renderCell(move, 'black')}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovesEditor;
