import Footer from "components/layout/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-6 pb-16 pt-24 md:pb-24 lg:px-8">
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
