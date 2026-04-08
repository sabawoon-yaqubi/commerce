import Footer from "components/layout/footer";
import ChildrenWrapper from "./children-wrapper";
import { Suspense } from "react";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto w-full max-w-screen-2xl px-5 pb-12 pt-24 sm:px-8 md:pb-16 lg:px-10">
        <Suspense fallback={null}>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
