# Video Slides

Animated HTML presentations that the presenter clicks through live and screen-records for videos.

## Language

**Deck**:
One HTML presentation, built for one video, that the presenter advances live while it is being screen-recorded.
_Avoid_: Film, render, slideshow

**Arc**:
The story shape a Talk follows (mystery then reveal, Experiment then surprise, incident timeline then lessons, or numbered rules), chosen per topic in its Outline. The voice stays the same across Arcs.
_Avoid_: Format, template, structure

**Outline**:
A one-page plan for a Talk (angle, story arc, real incidents, the evidence, sources) that the presenter approves before its Script is written.
_Avoid_: Brief, treatment, synopsis

**Script**:
The word-for-word narration for one video, written before its Deck. Each Deck is built from exactly one Script.
_Avoid_: Transcript, copy, voiceover

**Notes**:
The Script lines spoken during a Slide, visible only to the presenter in speaker view while recording.
_Avoid_: Speaker notes, teleprompter text

**Talk**:
A Deck the presenter delivers live on camera (face cam bottom-right), stepping through each point by hand. Its Script tells the topic as a story of real incidents and numbered rules.
_Avoid_: Lecture, presentation, webinar

**Series**:
An ordered set of Talks on one subject (SQL, databases, LLMs…) that rises in Level, each Talk still watchable on its own. A Talk outside any Series is a standalone Talk.
_Avoid_: Course, playlist, track

**Explainer**:
A Deck that plays its Steps by itself on timings matched to a narrated Script, usually carried by a Character.
_Avoid_: Film, animation, motion video

**Level**:
How much a Talk assumes the viewer already knows: Beginner, Intermediate or Advanced. Every Talk has exactly one Level.
_Avoid_: Difficulty, tier, track

**Cue**:
A ▶ mark in the Notes at the exact word where the next Step plays: the presenter's keypress in a Talk, a timed moment in an Explainer.
_Avoid_: Click marker, trigger, beat

**Slide**:
One screen of a Deck that the presenter advances to.
_Avoid_: Scene, beat, page

**Step**:
One click within a Slide that reveals or animates the next element, before the presenter moves to the next Slide.
_Avoid_: Fragment, build, beat

**Format**:
The canvas a Deck is shown in: Landscape (16:9, 1920x1080) or Vertical (9:16, 1080x1920). Every Deck supports both, with the same Slides in each.
_Avoid_: Orientation, aspect, size

**Experiment**:
A measurement run for a Talk (a query timed with and without an index, Bangla vs English token counts) whose real numbers appear on a Slide, with its code and raw results kept beside the Deck. Optional: a Talk without one takes its numbers from published sources and explains with Illustrations.
_Avoid_: Demo, benchmark, test

**Illustration**:
A worked example with assumed values ("ধরা যাক…"), labelled as an example on its Slide and never presented as a measurement or a published result. It may be static or a simulation that plays out in the Slide (probabilities shifting, a window sliding).
_Avoid_: Mock data, fake data

**Demo**:
A working piece inside a Slide that really runs while recording (a SQL query on real rows), used only where it works offline. Things that need the internet, like an LLM call, are shown as recorded Experiment output or an Illustration instead.
_Avoid_: Live coding, sandbox, playground

**Look**:
A Talk Deck's own skin on the shared Talk format: its colours, shapes and motion, chosen for its topic. The Slide layout, the parts, the typefaces and the solid dark background are the same in every Talk. A Look is either written for one Deck or shared from `lib/looks/` (Clay).
_Avoid_: Theme, style, template, world

**Asset**:
A real logo, photo or animation shown on a Slide, fetched from a free-license source and kept with a record of its source and license.
_Avoid_: Media, image, resource

**Character**:
A recurring person who carries a Deck's story (Rafi), taken from one creator's animation set so he looks the same in every Slide he appears in.
_Avoid_: Avatar, mascot, persona
