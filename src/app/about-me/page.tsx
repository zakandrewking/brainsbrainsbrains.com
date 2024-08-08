import Footer from "@/components/footer";
import PaperHeaderStatic from "@/components/header-static";

export default function AboutMe() {
  return (
    <div className="flex flex-col min-h-screen p-8 items-center">
      <PaperHeaderStatic isRolledUp={false} />
      {/* Plus more */}
      {/* <PaperHeaderDynamic /> */}
      <Footer />
    </div>
  );
}
