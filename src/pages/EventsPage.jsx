import EventHeader from "../components/events/EventHeader";
import EventCard from "../components/events/EventCard";

const splash1 = "https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/aee759d6c_IMG_7107.jpg";
const splash2 = "https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/fbb88c8c3_IMG_7108.png";

const events = [
  { title: "Christmas Light Trails", image: splash1 },
  { title: "J Cole", image: splash2 },
  { title: "Beyond Van Gogh and Beyond Monet", image: splash1 },
  { title: "Five, Ella Henderson and more!", image: splash2 },
  { title: "Gabby's Dollhouse Live!", image: splash1 },
];

export default function EventsPage() {
  return (
    <div>
      <EventHeader />
      <div className="flex flex-col gap-2 pt-2">
        {events.map((event, i) => (
          <EventCard key={i} title={event.title} image={event.image} />
        ))}
      </div>
    </div>
  );
}