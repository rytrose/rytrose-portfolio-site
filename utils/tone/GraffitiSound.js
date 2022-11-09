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
    let metadata = {
      seed: group.seed,
    };

    // Return metatdata about pattern
    return metadata;
  }

  schedulePattern(pattern) {
    if (pattern.seed in this.groups) {
      // Schedule next event in pattern
      // Recursively call schedulePattern(pattern)
    } else {
      delete this.groupPatterns[pattern.seed];
    }
  }

  async start() {
    await Tone.start();
    Tone.Transport.start();
  }
}
