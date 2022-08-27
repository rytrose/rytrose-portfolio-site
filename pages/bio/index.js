import Image from "next/image";
import InlineLink from "../../components/InlineLink";
import { buildS3URL } from "../../utils/s3";

const RESUME_SRC = "/resume.pdf";

const Bio = () => (
  <div
    className="flex flex-col items-center
    lg:flex-row lg:items-stretch lg:justify-around lg:gap-4"
  >
    <div className="lg:order-last overflow-hidden rounded-3xl">
      <Image
        className="rounded-3xl"
        src={buildS3URL("/profile-portugal.jpg")}
        alt="Ryan smiling in the sun"
        width={480}
        height={640}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAT/xAAeEAACAgEFAQAAAAAAAAAAAAACAwAEAQUGERQhcf/EABUBAQEAAAAAAAAAAAAAAAAAAAID/8QAGREBAQEBAQEAAAAAAAAAAAAAAQIEABFB/9oADAMBAAIRAxEAPwCO9rFvaN5mnbeGpUpmtFgl9NLOWGheSLkxzn3Pv2IiQ23U6LB+vLDJWeFPXw7/2Q=="
      ></Image>
    </div>
    <div className="mt-4 lg:w-1/2">
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
        As a tinkerer I delight in{" "}
        <InlineLink
          href="https://www.youtube.com/watch?v=lIFE7h3m40U"
          className="text-sm"
          target="_blank"
          underline
        >
          the bodge
        </InlineLink>
        , and feel at home at{" "}
        <InlineLink
          href="https://www.youtube.com/watch?v=yI0ksQ_5avQ"
          className="text-sm"
          target="_blank"
          underline
        >
          hackathons
        </InlineLink>
        . While by no means an electrician, I enjoy combining sensors and
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
