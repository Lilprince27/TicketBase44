export default function TicketQuantityModal({ onSelect, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[9998] flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-sm px-6 pt-6 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">How many Tickets?</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Select the number of tickets you're looking for</p>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => onSelect(n)}
              className="py-5 rounded-xl text-2xl font-bold border-2 cursor-pointer transition-all"
              style={{ borderColor: "#003057", color: "#003057", backgroundColor: "white" }}
              onMouseDown={e => { e.currentTarget.style.backgroundColor = "#003057"; e.currentTarget.style.color = "white"; }}
              onMouseUp={e => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "#003057"; }}
              onTouchStart={e => { e.currentTarget.style.backgroundColor = "#003057"; e.currentTarget.style.color = "white"; }}
              onTouchEnd={e => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "#003057"; }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}