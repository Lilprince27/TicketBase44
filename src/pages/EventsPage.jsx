import { useState } from "react";
import EventHeader from "../components/events/EventHeader";
import EventDetailModal from "../components/events/EventDetailModal";
import EventCard from "../components/events/EventCard";

const events = [
  { title: "Christmas Light Trails", image: "https://image2url.com/r2/default/images/1775675491036-181f2365-c8f0-4a7b-b3f5-2f2bcae4689c.jpeg", description: "Experience the magic of stunning light trails this Christmas season at a venue near you.", date: "Dec 2025 - Jan 2026", venue: "Various Venues" },
  { title: "J Cole", image: "https://image2url.com/r2/default/images/1775675383436-e1e0543f-643d-4b88-97b6-340500bd59f6.jpeg", description: "J. Cole brings his iconic rap performance live. Don't miss this unforgettable night.", date: "2026", venue: "O2 Arena, London" },
  { title: "Beyond Van Gogh and Beyond Monet", image: "https://image2url.com/r2/default/images/1775675576094-0686bd22-0605-43ac-a860-aaf045980fa5.jpeg", description: "Two spectacular immersive art experiences in one stunning venue. Step inside the paintings.", date: "18 Jul to 6 Aug 2026", venue: "Motorpoint Arena, Nottingham" },
  { title: "Five, Ella Henderson and more!", image: "https://image2url.com/r2/default/images/1775675645928-da337e46-6ef3-45c4-b6e1-7d6da3baba7d.jpeg", description: "A legendary lineup of pop icons performing live together for one epic night.", date: "Summer 2026", venue: "Wembley Arena, London" },
  { title: "Gabby's Dollhouse Live!", image: "https://image2url.com/r2/default/images/1775675731359-2af788a2-e883-43d4-8a28-cd006561c564.png", description: "Gabby and Pandy Paws come to life in this magical live show kids will love!", date: "2026 Tour", venue: "UK Tour" },
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div>
      <EventHeader />
      <div className="flex flex-col gap-2 pt-2">
        {events.map((event, i) => (
          <div key={i} onClick={() => setSelectedEvent(event)} className="cursor-pointer">
            <EventCard title={event.title} image={event.image} />
          </div>
        ))}
      </div>
      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}