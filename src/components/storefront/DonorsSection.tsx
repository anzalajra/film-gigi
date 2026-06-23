import { Section, DonorCard } from "./ds";

interface Donor {
  id: number;
  name: string;
  amount: number;
  message?: string | null;
  isAnonymous: boolean;
  showAmount: boolean;
  donatedAt: Date;
}

export default function DonorsSection({ donors }: { donors: Donor[] }) {
  if (!donors.length) return null;
  return (
    <Section id="donatur" eyebrow="Para Pendukung" band center>
      <div className="fg-donor-grid" style={{ maxWidth: "44rem", margin: "0 auto", textAlign: "left" }}>
        {donors.map((d, i) => (
          <div data-reveal data-delay={String((i % 2) + 1)} key={d.id}>
            <DonorCard
              name={d.name}
              amount={d.amount}
              message={d.message}
              anonymous={d.isAnonymous}
              showAmount={d.showAmount}
              date={new Date(d.donatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
