import { ServicePromisesRotator } from "components/home/service-promises-rotator";

const promises = [
  "Complimentary shipping over $200",
  "14-day returns",
  "2-year warranty",
  "Secure checkout",
] as const;

export function ServicePromises() {
  return (
    <section className="border-y border-black/[0.06] bg-[#f8f6f3]">
      <div className="mx-auto max-w-screen-2xl px-4 py-3 sm:px-8 lg:px-10 lg:py-3.5">
        <div className="lg:hidden">
          <ServicePromisesRotator items={promises} />
        </div>

        <ul className="hidden gap-4 lg:grid lg:grid-cols-4">
          {promises.map((item) => (
            <li
              key={item}
              className="text-left text-[10px] font-medium uppercase tracking-[0.18em] text-[#6e6962]"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
