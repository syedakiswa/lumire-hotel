import { Link } from "react-router-dom";
const rooms = [
  {
    name: "Lobby Reception",
    category: "Luxury Lobby",
    description:
      "A grand welcome with sophisticated design and warm hospitality.",
    image: "/reception.jpeg",
    delay: 100,
  },
  {
    name: "Presidential Suite",
    category: "Luxury Suite",
    price: "$890",
    description:
      "An extraordinary suite designed for the ultimate luxury experience with elegant interiors and exceptional comfort.",
    image: "/room.jpeg",
    delay: 200,
  },
  {
    name: "Conference Hall",
    category: "Meetings & Events",
    description:
      "An elegant and fully equipped space designed for conferences, meetings, and special events.",
    image: "/conference.jpeg",
    delay: 300,
  },
];

function FeaturedRooms() {
  return (
    <section id="rooms" className="bg-black text-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

        {/* Section Heading */}
        <div className="max-w-2xl mx-auto text-center">
          <p
            data-aos="fade-up"
            className="text-amber-400 uppercase tracking-[3px] md:tracking-[4px] text-xs md:text-sm mb-4"
          >
            Stay With Us
          </p>

          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide leading-tight"
          >
            Featured Rooms &amp; Suites
          </h2>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-5 text-gray-400 text-sm md:text-base leading-relaxed"
          >
            Discover beautifully designed spaces where timeless elegance,
            comfort, and exceptional hospitality come together.
          </p>
        </div>

        {/* Room Cards */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.name}
              data-aos="fade-up"
              data-aos-delay={room.delay}
              className="group flex flex-col bg-neutral-950 border border-white/10 hover:border-amber-400/40 transition duration-500"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-64 object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 md:p-7">
                <p className="text-amber-400 uppercase tracking-[3px] text-xs mb-3">
                  {room.category}
                </p>

                <h3 className="text-2xl font-light tracking-wide">
                  {room.name}
                </h3>

                <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                  {room.description}
                </p>

                {/* Divider + Price */}
                <div className="mt-auto pt-6">
                  <div className="border-t border-white/10 pt-5 flex items-center justify-between gap-4">
                    {room.price ? (
                      <div>
                        <span className="text-amber-400 font-medium text-base">
                          {room.price}
                        </span>
                        <span className="text-gray-400 text-xs"> / night</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs uppercase tracking-wider">
                        {room.category}
                      </span>
                    )}

                    <Link
                      to={room.price ? "/rooms/presidential-suite" : "/rooms"}
                      className="text-amber-400 text-xs uppercase tracking-widest hover:text-amber-300 transition"
                    >
                      {room.price ? "View Suite →" : "Explore →"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Rooms */}
        <div className="mt-12 md:mt-16 text-center" data-aos="fade-up">
          <Link
            to="/rooms"
            className="inline-block px-8 py-3 border border-amber-400 text-amber-400 uppercase tracking-widest text-xs md:text-sm hover:bg-amber-400 hover:text-black transition duration-300"
          >
            View All Rooms
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FeaturedRooms;