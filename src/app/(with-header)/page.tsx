import Footer from "@/components/footer";
import PaperHeader from "@/components/paper-header";

export default function Home() {
  return (
    <>
      <PaperHeader isRolledUp={true} />
      <main className="flex flex-col items-center w-full mt-48 px-8">
        :content:
      </main>
      <Footer />
    </>
  );
}
