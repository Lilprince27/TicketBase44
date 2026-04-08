import EventHeader from "../components/events/EventHeader";
import EventCard from "../components/events/EventCard";

const events = [
  { title: "Christmas Light Trails", gradient: "linear-gradient(to right, #4a90e2, #9013fe)" },
  { title: "J Cole", gradient: "linear-gradient(to right, #8b572a, #417505)" },
  { title: "Beyond Van Gogh and Beyond Monet", gradient: "linear-gradient(to right, #f5a623, #d0021b)" },
  { title: "Five, Ella Henderson and more!", gradient: "linear-gradient(to right, #bd10e0, #4a90e2)" },
  { title: "Gabby's Dollhouse Live!", gradient: "linear-gradient(to right, #f8e71c, #7ed321)" },
];

export default function EventsPage() {
  return (
    <div>
      <EventHeader />
      <div className="flex flex-col gap-2 pt-2">
        {events.map((event, i) => (
          <EventCard key={i} title={event.title} gradient={event.gradient} />
        ))}
      </div>
    </div>
  );
}