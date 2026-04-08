import EventHeader from "../components/events/EventHeader";
import EventCard from "../components/events/EventCard";

const events = [
  { title: "Christmas Light Trails", image: "https://image2url.com/r2/default/images/1775675491036-181f2365-c8f0-4a7b-b3f5-2f2bcae4689c.jpeg" },
  { title: "J Cole", image: "https://image2url.com/r2/default/images/1775675383436-e1e0543f-643d-4b88-97b6-340500bd59f6.jpeg" },
  { title: "Beyond Van Gogh and Beyond Monet", image: "https://image2url.com/r2/default/images/1775675576094-0686bd22-0605-43ac-a860-aaf045980fa5.jpeg" },
  { title: "Five, Ella Henderson and more!", image: "https://image2url.com/r2/default/images/1775675645928-da337e46-6ef3-45c4-b6e1-7d6da3baba7d.jpeg" },
  { title: "Gabby's Dollhouse Live!", image: "https://image2url.com/r2/default/images/1775675731359-2af788a2-e883-43d4-8a28-cd006561c564.png" },
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