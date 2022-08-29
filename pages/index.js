import S3Image from "../components/S3Image";

const Home = () => {
  const height = 528;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 align-items-center justify-items-center gap-6 [&>*]:rounded-3xl">
      <S3Image
        path="/suit-formal.jpg"
        alt="Ryan smiling past the camera"
        // 3:4
        width={height * (3 / 4)}
        height={height}
        blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAEAAMDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAgEAABAwMFAQAAAAAAAAAAAAABAAIEAwUGBxESEzEh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAv/EABsRAAIBBQAAAAAAAAAAAAAAAAEDAAIRMlGR/9oADAMBAAIRAxEAPwCEyfW/M7RfJNuiSYnRF4UWF9AFxDWgbn76fSiIgErtiORBle5//9k="
      />
      <div className="flex items-center [&>*]:rounded-3xl">
        <S3Image
          path="/shimi.jpeg"
          alt="Ryan leaning over a tabletop robot named Shimi"
          // 4:3
          width={height * (4 / 3)}
          height={height}
          blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAfEAABBQABBQAAAAAAAAAAAAABAAIDBAUHBhMxQYH/xAAVAQEBAAAAAAAAAAAAAAAAAAAFBv/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMxUf/aAAwDAQACEQMRAD8AquJsGj1Lxtg6e667cvzRymSZ96cFx78h9PA8kn6iIpmy6wOQGO9iyopGT//Z"
        />
      </div>
      <div className="flex items-center [&>*]:rounded-3xl">
        <S3Image
          path="/kemeny-concerto.jpeg"
          alt="Ryan standing in front of a synmphonic band as a soloist"
          // 3:2
          width={height * (3 / 2)}
          height={height}
          blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAdEAACAgIDAQAAAAAAAAAAAAABAgMEAAYFCCEx/8QAFQEBAQAAAAAAAAAAAAAAAAAABAX/xAAZEQEAAgMAAAAAAAAAAAAAAAABAAIDBCH/2gAMAwEAAhEDEQA/AJjsTyM+obxU43X1rVqZoJKVetHMzMZJASXkVmPgA9PwDGMYLX7iqspWCf/Z"
        />
      </div>
      <S3Image
        path="/fancy.jpeg"
        alt="Ryan taking a mirror selfie"
        // 3:4
        width={height * (3 / 4)}
        height={height}
        blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAEAAMDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAdEAABBQADAQAAAAAAAAAAAAABAAIDBBEFBgdB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAVEQEBAAAAAAAAAAAAAAAAAAAAEf/aAAwDAQACEQMRAD8AqHmXn/ASdRjbLWkeYbl2uHGQgubHalY0nMG40afp0oiKdN//2Q=="
      />
    </div>
  );
};

export default Home;
