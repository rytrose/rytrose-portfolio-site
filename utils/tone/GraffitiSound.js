import * as Tone from "tone";

export class GraffitiSound {
  constructor() {
    this.groups = {};
    this.groupPatterns = {};
  }

  updateGroups(groups) {
    // Update the current map of seed to group
    this.groups = groups.reduce(
      (newGroups, group) => ({ ...newGroups, [group.seed]: group }),
      {}
    );

    // Determine the new groups that need a pattern
    const newGroups = Object.values(this.groups).filter(
      (group) => !(group.seed in this.groupPatterns)
    );

    // Create new patterns for new groups
    this.groupPatterns = newGroups.reduce(
      (newGroupPatterns, group) => ({
        ...newGroupPatterns,
        [group.seed]: this.newGroupPattern(group),
      }),
      this.groupPatterns
    );
  }

  newGroupPattern(group) {
    // Analyze group and derive metadata
    let pattern = {
      seed: group.seed,
    };

    // Time is relative to now, start immediately
    this.schedulePattern(pattern, "+0");

    // Return pattern object
    return pattern;
  }

  schedulePattern(pattern, time) {
    if (pattern.seed in this.groups) {
      // Schedule next event in pattern
      // Recursively call schedulePattern(pattern, time)
      Tone.Transport.schedule((time) => {
        // TODO: make music
        this.synth.triggerAttackRelease("A3", "16n");
        const next = `@4n`;
        console.log(next);
        this.schedulePattern(pattern, next);
      }, time);
    } else {
      console.log("removing pattern:", pattern.seed);
      delete this.groupPatterns[pattern.seed];
    }
  }

  async start() {
    this.synth = new Tone.MonoSynth().toDestination();
    await Tone.start();
    Tone.Transport.start();
  }
}
