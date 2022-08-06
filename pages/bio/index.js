import Image from "next/image";
import Link from "next/link";
import InlineLink from "../../components/InlineLink";
import { buildS3URL } from "../../utils/s3";

const RESUME_SRC = "/resume.pdf";

const Bio = () => (
  <div
    className="flex flex-col items-center 
    sm:flex-row sm:items-stretch sm:justify-around sm:gap-4"
  >
    <div className="sm:order-last">
      <Image
        className="rounded-3xl"
        src={buildS3URL("/profile-portugal.jpg")}
        alt="Ryan smiling in the sun"
        width={480}
        height={640}
      ></Image>
    </div>
    <div className="mt-4 sm:w-1/2">
      <p className="font-serif text-2xl">I am...</p>
      <p className="text-sm mt-4">
        ...among other things a musician, a technologist, and a tinkerer. I
        studied computer engineering and music at Case Western Reserve
        University in Cleveland, OH, as well as Music Technology at the Georgia
        Tech Center for Music Technology in Atlanta, GA.
      </p>
      <p className="text-sm mt-4">
        As a musician I studied saxophone with Greg Banaszak, and have played
        for artists such as Olli-Pekka Tuomisalo, Velvet Brown, Bill Dobbins,
        and George Weremchuck among others. I&apos;ve had the pleasure of
        playing as a soloist and in chamber groups internationally in Germany,
        the Netherlands, and Finland. I directed all-male a cappella ensembles
        for multiple years, arranging dozens of pop and contemporary songs.
      </p>
      <p className="text-sm mt-4">
        As a technologist I work by day as a software engineer, designing and
        implementing distributed systems providing software experiences for
        connected products. I primarily write in golang and python, but pride
        myself in being as polyglot as possible. I have experience writing
        server, web frontend, desktop frontend, embedded, motor control, and DSP
        code.
      </p>
      <p className="text-sm mt-4">
        As a tinkerer I delight in the bodge, and feel at home at hackathons.
        While by no means an electrician, I enjoy combining sensors and
        materials, bringing my creations to life with code. My work spaces are
        cluttered with components and computing machines.
      </p>
      <p className="mt-8">
        <InlineLink
          href={buildS3URL(RESUME_SRC)}
          className="text-sm"
          target="_blank"
          border
        >
          resumé
        </InlineLink>
      </p>
    </div>
  </div>
);

export default Bio;
