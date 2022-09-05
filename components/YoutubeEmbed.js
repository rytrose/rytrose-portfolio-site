const YoutubeEmbed = ({ embedID }) => (
  <div
    className="mt-4 relative overflow-hidden pb-[56.25%] h-0
  [&>iframe]:absolute [&>iframe]:left-0 [&>iframe]:top-0 [&>iframe]:h-full [&>iframe]:w-full"
  >
    <iframe
      width="853"
      height="480"
      src={`https://www.youtube.com/embed/${embedID}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

export default YoutubeEmbed;
