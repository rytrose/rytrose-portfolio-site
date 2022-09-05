import ProjectCard from "../../components/projects/ProjectCard";
import InlineLink from "../../components/InlineLink";
import YoutubeEmbed from "../../components/YoutubeEmbed";
import { buildS3URL } from "../../utils/s3";

const Projects = () => {
  return (
    <div>
      <article
        className="
        before:fixed before:content-[''] before:top-0 before:w-[1px] before:h-screen before:bg-slate-300
        before:left-0 before:ml-8 sm:before:ml-12 lg:before:ml-0 lg:before:left-[50%]"
      >
        <ProjectCard title="Flame Keepers" date="february, 2021">
          <p>
            <InlineLink href="https://flamekeepers.metropolisensemble.org/">
              Flame Keepers
            </InlineLink>{" "}
            is a perpetual music installation based on{" "}
            <InlineLink href="http://www.jakubciupinski.com/">
              Jakub Ciupinski
            </InlineLink>
            &apos;s concept and design, built by Ryan Rose and{" "}
            <InlineLink href="http://www.avneeshsarwate.com">
              Avneesh Sarwate
            </InlineLink>
            .
          </p>
          <p className="mt-2">
            Every week, a composer is sponsored by{" "}
            <InlineLink href="https://metropolisensemble.org/">
              Metropolis Ensemble
            </InlineLink>{" "}
            to contribute compositions to the installation. After uploading a
            composition, the composer must wait seven hours to upload another.
            Once able, if the composer does not upload a composition after seven
            hours Flame Keepers will insert a randomly selected composition from
            its archives, and the seven hour lockout begins again.
          </p>
        </ProjectCard>
        <ProjectCard title="chronophonics" date="july, 2020">
          <p>
            <InlineLink href="https://nime2020.bcu.ac.uk/chronophonics/">
              Chronophonics
            </InlineLink>{" "}
            is an online installation created by Ryan Rose,{" "}
            <InlineLink href="http://zequencer.io/">Alex Resende</InlineLink>,
            and{" "}
            <InlineLink href="http://www.avneeshsarwate.com">
              Avneesh Sarwate
            </InlineLink>
            . Inspired by online art experiences like Reddit&apos;s{" "}
            <InlineLink href="https://www.reddit.com/r/place/">
              r/place
            </InlineLink>
            , chronophonics is a series of networked musical interfaces where
            visitors can make changes to the music and submit those changes to
            the shared history of the interface. Each interface allows visitors
            to traverse the history of the canvas and see other&apos;s changes.
            Animations running in the background of each canvas are reactive to
            the music being created, and change along with the music as visitors
            traverse the history of a canvas.
          </p>
          <p className="mt-2">
            The amount of change able to be contributed to a musical canvas at
            once is limited to a certain number of actions, with a countdown
            timer displaying when additional actions are permitted. An interface
            will sometimes constrain actions&mdash;like a virtual conductor
            guiding performers to play a score. Scrolling through the history
            reveals the arcs of the conductor&apos;s influence.
          </p>
        </ProjectCard>
        <ProjectCard
          title="shimi"
          date="may, 2019"
          modal={
            <p className="text-sm max-w-2xl">
              <p className="mt-2 font-serif text-lg">demo</p>
              <p>
                Using a non-verbal voice designed by{" "}
                <InlineLink href="https://richardsavery.com/">
                  Richard Savery
                </InlineLink>
                , Ryan Rose developed a singing program that analyzes input
                music and allows Shimi to sing and dance along with the
                predominant melody.
              </p>
              <YoutubeEmbed embedID="kdcU05oIBdE"></YoutubeEmbed>
              <p className="mt-8 font-serif text-lg">publications</p>
              <p className="[&>*]:mt-2 text-sm">
                <p>
                  <InlineLink
                    href={buildS3URL("/Masters_Project_Paper_Final.pdf")}
                  >
                    Ryan Rose GTCMT Master&apos;s project paper
                  </InlineLink>
                </p>
                <p className="italic">
                  <InlineLink href="https://lac.linuxaudio.org/2019/doc/savery.pdf">
                    Savery, Richard, Ryan Rose, and Gil Weinberg. &quot;Finding
                    Shimi&apos;s voice: fostering human-robot communication with
                    music and a NVIDIA Jetson TX2.&quot; Proceedings of the 17th
                    Linux Audio Conference. 2019.
                  </InlineLink>
                </p>
                <p className="italic">
                  <InlineLink
                    href={buildS3URL(
                      "Establishing_Human-Robot_Trust_through_Music-Driven_Robotic_Emotion_Prosody_and_Gesture.pdf"
                    )}
                  >
                    Savery, Richard, Ryan Rose, and Gil Weinberg.
                    &quot;Establishing Human-Robot Trust through Music-Driven
                    Robotic Emotion Prosody and Gesture.&quot; 2019 28th IEEE
                    International Conference on Robot and Human Interactive
                    Communication (RO-MAN). IEEE, 2019.
                  </InlineLink>
                </p>
              </p>
            </p>
          }
        >
          <p>
            Shimi is a robotic musical companion built at the Georgia Tech
            Center for Music Technology. Shimi explores how music and gesture
            can be used to express emotion in low degree-of-freedom robots.
            Shimi features 5 Dynamixel motors is controlled via an NVIDIA Jetson
            TX2 and an extensible python codebase.
          </p>
        </ProjectCard>
        <ProjectCard title="recorder bot" date="august, 2018">
          <p>
            An autonomous recorder player with solenoid fingers, motorized
            expressive movements, and real human hair. Built with{" "}
            <InlineLink href="https://richardsavery.com/">
              Richard Savery
            </InlineLink>{" "}
            and{" "}
            <InlineLink href="https://zrkmusic.bandcamp.com/">
              Zach Kondak
            </InlineLink>
            .
          </p>
          <YoutubeEmbed embedID="zWl6llFeaVQ"></YoutubeEmbed>
        </ProjectCard>
        <ProjectCard title="SoundCage" date="august, 2018">
          <p>
            A closet-sized tangible experience that encourages visitors to
            explore strings extending from sensor packages mounted in a PVC
            frame to create sound.
          </p>
          <YoutubeEmbed embedID="gDkEvhYeeKs"></YoutubeEmbed>
        </ProjectCard>
        <ProjectCard title="twitthear" date="december, 2017">
          <p>
            An audio interface that brings Twitter to the virtual personal
            assistant Amazon Alexa. Its goal is to encode information about a
            tweet in musical phrase for a user to listen to, and decide whether
            or not to save the tweet to read on a visual interface later.
          </p>
          <YoutubeEmbed embedID="ksoXnWqxwmM"></YoutubeEmbed>
        </ProjectCard>
      </article>
    </div>
  );
};

export default Projects;
