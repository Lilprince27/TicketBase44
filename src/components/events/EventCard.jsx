export default function EventCard({ title, image }) {
  return (
    <div className="bg-white w-full">
      <div className="w-full h-[200px] bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="px-4 py-3.5 text-[15px] font-medium text-gray-800">
        {title}
      </div>
    </div>
  );
}