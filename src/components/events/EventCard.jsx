export default function EventCard({ title, gradient }) {
  return (
    <div className="bg-white w-full">
      <div className="w-full h-[200px]" style={{ background: gradient }} />
      <div className="px-4 py-3.5 text-[15px] font-medium text-gray-800">
        {title}
      </div>
    </div>
  );
}