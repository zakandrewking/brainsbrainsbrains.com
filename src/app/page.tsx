export default function Home() {
  return (
    <div className="flex flex-col gap-2 min-h-screen">
      <header className="flex flex-col gap-2 p-10 items-center">
        <div className="flex flex-col gap-2 items-center">
          The personal website of
          <span className="font-bold">Zak King</span>
        </div>
        <img
          src="/zak.png"
          alt="Pic of Zak"
          className="rounded-lg h-48 w-48 my-3"
        />
        Reach me on:
        <div className="flex flex-row gap-3">
          <a href="https://github.com/zakandrewking">GitHub</a>
          <a href="https://twitter.com/brainsbrainsbr">Twitter</a>
          <a href="https://www.linkedin.com/in/zakandrewking/">LinkedIn</a>
        </div>
      </header>
      <main className="p-10 flex flex-col gap-4">{/* <div>Posts</div> */}</main>
    </div>
  );
}
