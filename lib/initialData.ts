export const NEUTRON_5_MANUAL = {
  name: 'iZotope Neutron 5 Manual.pdf',
  content: `
Table of Contents
1. Introduction ................................................................................................................. 1
Included Plug-ins ........................................................................................................ 1
2. Neutron Elements ......................................................................................................... 3
Workflow ................................................................................................................... 3
Assistant View Interface .............................................................................................. 5
3. Getting Started ........................................................................................................... 11
Navigating the Detailed View ...................................................................................... 11
Navigating the Assistant View ..................................................................................... 12
Signal Flow .............................................................................................................. 12
Working with the Signal Chain ..................................................................................... 13
Working with Neutron Plug-ins .................................................................................... 13
Workflow Suggestions ............................................................................................... 13
Working with IPC ...................................................................................................... 14
4. General Controls ......................................................................................................... 15
Resize Window ......................................................................................................... 15
Global Controls ........................................................................................................ 15
Signal Chain ............................................................................................................. 17
I/O Panel ................................................................................................................. 18
Multiband Crossover Spectrum View ........................................................................... 23
Detection Filter View ................................................................................................. 24
LFE (Low-frequency effects) ....................................................................................... 25
5. Assistant ................................................................................................................... 27
Assistant: Neutron mothership plug-in ......................................................................... 27
Assistant: Visual Mixer plug-in .................................................................................... 35
6. Gate .......................................................................................................................... 41
Module Interface ...................................................................................................... 41
Module Header ......................................................................................................... 41
Meters and Displays .................................................................................................. 42
Controls .................................................................................................................. 43
Advanced Controls .................................................................................................... 44
7. Equalizer ................................................................................................................... 45
Module Interface ...................................................................................................... 45
Meters and Displays .................................................................................................. 45
Module Header ......................................................................................................... 47
Controls .................................................................................................................. 49
Advanced Panel ........................................................................................................ 56
8. Masking Meter ........................................................................................................... 59
Problem with Masking ............................................................................................... 59
Using The Masking Meter .......................................................................................... 59
Masking Meter Interface ............................................................................................ 60
Meters and Displays .................................................................................................. 60
Masking Meter Controls ............................................................................................. 63
EQ Masking Controls ................................................................................................. 64
9. Compressor ............................................................................................................... 65
Module Interface ...................................................................................................... 65
Module Header ......................................................................................................... 65
Meters and Displays .................................................................................................. 67
Controls .................................................................................................................. 69
10. Transient Shaper ...................................................................................................... 74
Module Interface ...................................................................................................... 74
Meters and Displays .................................................................................................. 74
Module Header ......................................................................................................... 75
HUD Controls ........................................................................................................... 77
11. Exciter ..................................................................................................................... 79
Module Interface ...................................................................................................... 79
Module Header ......................................................................................................... 79
Meters and Displays .................................................................................................. 81
Controls .................................................................................................................. 82
12. Sculptor ................................................................................................................... 84
Module Interface ...................................................................................................... 84
Meters and Displays .................................................................................................. 85
Module Header ......................................................................................................... 86
Controls .................................................................................................................. 87
13. Unmask ................................................................................................................... 89
Module Interface ...................................................................................................... 89
Module Header ......................................................................................................... 90
Meters and Displays .................................................................................................. 90
Controls .................................................................................................................. 91
14. Clipper .................................................................................................................... 93
Module Interface ...................................................................................................... 93
Module Header ......................................................................................................... 93
Meters and Displays .................................................................................................. 95
Controls .................................................................................................................. 96
15. Density .................................................................................................................... 97
Module Interface ...................................................................................................... 97
Module Header ......................................................................................................... 97
Meters and Displays .................................................................................................. 99
Controls ................................................................................................................ 100
16. Phase .................................................................................................................... 102
Module Interface .................................................................................................... 102
Module Header ....................................................................................................... 102
Meters and Displays ................................................................................................ 104
Controls ................................................................................................................ 104
17. Visual Mixer ........................................................................................................... 107
Plug-in Interface ..................................................................................................... 107
Plug-in Controls ...................................................................................................... 107
Plug-in List ............................................................................................................ 108
Mix Snapshots ....................................................................................................... 108
Activity Metering ..................................................................................................... 109
18. Glossary ................................................................................................................ 110
Band ..................................................................................................................... 110
Band shelf ............................................................................................................. 110
Bandpass .............................................................................................................. 110
Bandwidth ............................................................................................................. 110
Baxandall .............................................................................................................. 110
Butterworth filter .................................................................................................... 110
Component Plug-in ................................................................................................. 110
Crossover .............................................................................................................. 110
Detection circuit ..................................................................................................... 110
Envelope ............................................................................................................... 111
FFT (Fast Fourier Transform) .................................................................................... 111
Filter ..................................................................................................................... 111
Inter Plug-in Communication (IPC) ............................................................................. 111
HUD (Heads-Up Display) .......................................................................................... 111
Hysteresis ............................................................................................................. 111
LFE (Low-Frequency Effects) .................................................................................... 111
Limiter .................................................................................................................. 111
Masking ................................................................................................................ 111
Mothership ............................................................................................................ 111
Multiband .............................................................................................................. 112
Pre-Emphasis ........................................................................................................ 112
Q .......................................................................................................................... 112
Resonant Filter ....................................................................................................... 112
Saturation ............................................................................................................. 112
Sidechain .............................................................................................................. 112
Short Term Loudness .............................................................................................. 112
Spectral Shaping .................................................................................................... 112
Spectrum Analyzer .................................................................................................. 112
Waveform ............................................................................................................. 112
19. Presets .................................................................................................................. 113
Global Presets ........................................................................................................ 113
Module Presets ...................................................................................................... 113
Factory and Custom Presets .................................................................................... 113
Presets Window Footer ........................................................................................... 114
Preset Locations .................................................................................................... 114
20. Options ................................................................................................................. 116
General Options ...................................................................................................... 116
Metering Options .................................................................................................... 117
EQ Options ............................................................................................................ 119
Module Options ...................................................................................................... 119
21. License Information ................................................................................................ 121
Anti-Grain Geometry ................................................................................................ 121
base64 .................................................................................................................. 121
Better Enums ......................................................................................................... 122
Box2D ................................................................................................................... 122
Bravura ................................................................................................................. 123
C++ Rest SDK ........................................................................................................ 124
Eigen .................................................................................................................... 126
FLAC .................................................................................................................... 126
FreeType ............................................................................................................... 127
GLEW ................................................................................................................... 127
gsl ........................................................................................................................ 128
IcoMoon ............................................................................................................... 129
Intel® Integrated Performance Primitives (Intel® IPP) .................................................. 129
JsonCpp ............................................................................................................... 129
LAME .................................................................................................................... 130
LibXML2 ............................................................................................................... 130
Material Docs Theme .............................................................................................. 131
NLohmann JSON .................................................................................................... 131
nanomsg ............................................................................................................... 131
Netlib numeralgo na10 Aberth’s method ..................................................................... 132
OGG / Vorbis .......................................................................................................... 132
readerwriterqueue .................................................................................................. 133
Roboto font family .................................................................................................. 133
Skia ...................................................................................................................... 134
TagLib .................................................................................................................. 134
TinyXML ................................................................................................................ 134
Tipue Search .......................................................................................................... 135
vectorize ............................................................................................................... 135
WebView2 ............................................................................................................. 135
xsimd ................................................................................................................... 136
Yoga ..................................................................................................................... 136
ZeroMQ ................................................................................................................. 137
zlib ....................................................................................................................... 137
1. Introduction
Bring out the best in your mix with Neutron 5, a flexible, fully-equipped suite of 10 intelligent tools.
Add power while reclaiming headroom with the multiband Clipper module, give your audio more
presence, detail, and fullness with intuitive upward compression in the new Density module, and fix
tedious phase issues with the Phase module.
Shape your sound faster with the improved Mix Assistant, precisely target your processing with
mid/side and transient/sustain channel modes across the Neutron suite, and make more informed
decisions with beautiful, refreshed visualizations. Achieve the mix you’re imagining, whether it’s
your first mix or your next big hit.
Included Plug-ins
PLUG-IN
Neutron 5 Improved!
Neutron 5 Clipper New!
Neutron 5 Compressor Improved!
Neutron 5 Density New!
Neutron 5 EQ Improved!
Neutron 5 Exciter Improved!
Neutron 5 Gate Improved!
Neutron 5 Phase New!
Neutron 5 Sculptor Improved!
Neutron 5 Transient Shaper Improved!
PLUG-IN
Neutron 5 Unmask Improved!
Visual Mixer
Relay
Tonal Balance Control 2
2. Neutron Elements
Neutron Elements features the Assistant plugin from Neutron 5. The Assistant helps you achieve
your creative intent for individual elements of your mix, helping you finish your project with
confidence. We highly encourage you to use Neutron Elements for individual track processing.
Learn more about Neutron 5 and how to upgrade from Neutron Elements on our
website: https://www.izotope.com/en/products/neutron.html
Workflow
Add Neutron Elements to a track in your session.
Click the “Go” button in the start page to run the Assistant.
Neutron Elements will listen to your track and suggest a starting point.
To run the Assistant again, click the Assistant button in the header of the plug-in.
Assistant View Interface
1. Intent Controls
2. Target Library
3. Meters
Intent Controls
Intent controls are parameters that allow for broad control over early decisions in your mixing
workflow. They work together with Neutron’s intelligent analysis and Targets to give you a simple
workflow for tonal, dynamics, character, and width decisions in your mix.
The following Intent control sections are available:
• Tone
• Dynamics
• Saturation
• Width
Intent controls are linked to deeper controls in the Detailed View that are only accessible in Neutron
5.
Tone
• Equalizer: Blends the EQ shape that Mix Assistant suggested after its analysis. You can
increase or decrease the effect of this processing with this control.
• Sculptor: This parameter adjusts the amount of spectral tone shaping aimed at matching the
selected target curve. The target curves are the idealized tonal of the selected instrument
based off analysis of thousands of professional mixes.
Dynamics
• Density: Adjusts the Range of the upward compression applied as signal falls below the
threshold. Threshold and other controls are available in the Density module in Neutron 5.
• Compressor: Adjusts the blend of Compression.
Width
• Width: Adjusts the global Width of Neutron. You can widen or narrow stereo signals by
adjusting this control.
Saturation
• Drive: Adjusts the amount of distortion applied to the input signal.
• Processing Modes: The processing mode in the Exciter changes the style of distortion between
subtle and dramatic harmonic profiles per band. Classic processing mode (top) provides four
modes for subtle excitation use cases. Trash processing mode (bottom) provides four modes
for dramatic distortion use cases.
• XY Pad: Blends different harmonic profiles to achieve the sound you want to hear.
• Tone: Tone adjusts the balance of distortion applied to low and high frequency content in the
Exciter. Values between -100 and 0 emphasize low frequency content; Values between 0 and
100 emphasize high frequency content.
Target Library
The Target Library contains instrument targets and user generated reference targets. Setting a
target provides helpful starting points for the Intent controls in the Assistant.
Instrument Target
Instrument targets are intelligent starting points for your audio. This dramatically changes the
sound of the processing applied to the input signal. A recommended starting point will be
suggested after Neutron listens to your audio.
Reference Targets
You can create and manage your own custom reference targets by importing audio files from your
computer.
Press the (+) button to open a system dialog and select audio files on your computer to add to your
custom Target Library.
Selecting a sound, clip, or stem will copy the name and that file into the Custom target area of
Neutron’s Target Library. Targets from Audiolens will appear in this area of the Target Library.
Meters
The Tonal Balance Target Meter displays audio as a frequency spectrum, providing a helpful
visualization of the selected Instrument Target’s intended shape against the output signal.
Switching targets will change the shape of the Tonal Balance Target Meter.
3. Getting Started
Welcome to Neutron 5! If you have never used an iZotope product or want to know more about
Neutron, then this is the right chapter for you. The topics include:
• Navigating the Detailed View
• Navigating the Assistant View
• Signal Flow
• Working with the Signal Chain
• Working with Neutron Plug-ins
• Workflow Suggestions
• Working with IPC
Navigating the Detailed View
The Neutron 5 Detailed view is divided into four main areas as seen in the image below:
1. Global Header: The global header area provides access to: the IPC plug-in name editor, Mix
Assistant, the Preset Manager, Undo History, Zero Latency, Options, and Help.
2. Signal Chain: The Signal Chain allows you to add or remove modules and adjust the processing
order of modules included in the chain. The Signal Chain area is exclusive to the Neutron 5
mothership plug-in, Neutron 5 component plug-ins do not include the Signal Chain because
they only include one processing module. See the Signal Chain section for more information.
3. I/O Panel: The Input/Output (I/O) panel area includes: global I/O gain controls, I/O metering,
channel operations controls, and global bypass. See the I/O Panel section for more
information.)
4. Module Interface: The module panel area includes all controls and meters associated with a
specific processing module.
Visit the General Controls chapter to learn more about the I/O panel and global header
controls.
Navigating the Assistant View
The Neutron 5 Assistant View is divided into three main areas as seen in the image below:
1. Controls: The Controls provide broad control over the amount of tonal, dynamics, saturation,
and width processing in Neutron 5. These are intelligently set when you access the Assistant
for the first time in Neutron 5.
2. Target Library: The Target Library lists all available targets that Neutron 5 uses to generate an
intelligent starting point for input audio. These are organized by instrument type and provide a
Custom Folder for user-generated targets.
3. Metering: The metering in the Assistant View shows you input audio against the frequency
balance of the currently selected reference Target or Reference file.
LEARN MORE: NEUTRON 5 ASSISTANT
You can learn more about working with the Neutron 5 Assistant in the Assistant
chapter.
Signal Flow
The following diagram represents the signal flow in the Neutron plug-in.
1. Input Gain
2. Signal Chain (Mothership plug-in only)
3. Output Gain
4. Limiter (Mothership plug-in only)
Working with the Signal Chain
You can add, remove, and reorder modules in the Signal Chain area of the Neutron 5 mothership
plug-in. By default, the Neutron 5 Signal Chain includes the Equalizer module.
For more information about working with the Signal Chain, visit the General Controls
chapter.
Working with Neutron Plug-ins
Throughout this manual, the terms “Mothership” and “Component” are used to describe plug-ins
included with Neutron 5.
• Mothership plug-in:
• Refers to the main Neutron 5 plug-in.
• Offers multiple processing modules in a single plug-in instance.
• Component plug-in:
• Refers to the plug-in equivalent of any individual module included in the Neutron Mothership
plug-in. i.e. Compressor, Equalizer, etc…
• Offers focused control over an individual processing module.
Mothership and Component Plug-in Feature Differences
Some features included in the Neutron 5 mothership plug-in are not available in the Neutron 5
component plug-ins. Differences include:
• The Limiter is only available in the Neutron mothership plug-in.
• The Mix Assistant is only available in the Neutron mothership plug-in.
Workflow Suggestions
There are a number of different ways to approach working with Neutron plug-ins. We’ve included
some workflow suggestions you can use if you aren’t sure where to start. These workflows are
merely suggestions and any workflow is valid if it works for you.
Using the Assistant
The Neutron 5 mothership plug-in and Neutron 5 Visual Mixer plug-in offer intelligent assistive
features aimed at helping you find a starting point for your track or entire mix based on an analysis
of your audio.
Use the Assistant to build a starting point for an individual track. You can access the Assistant by
inserting the Neutron 5 mothership plug-in on a track and clicking the Assistant button to the left of
the Presets button in the global header area.
See the Assistant chapter for more information about working with the Assistant.
Using Presets
Neutron 5 plug-ins include a built in preset manager with a wide variety of factory presets to get
you started. Open the Preset Manager by clicking the Presets button in the global header area of
any Neutron 5 plug-in (except for Visual Mixer). Load a preset by selecting it in the preset manager
window or quickly try out different global presets by clicking the left and right arrow buttons
directly to the right of the Presets button in the global header area.
Learn more about working with the Neutron Preset Manager in the Presets chapter.
The Neutron mothership plug-in includes a global preset manager and a module
preset manager. You can load presets that apply to a single module by clicking the
Preset button in the module’s Signal Chain selector.
Working with IPC
Wouldn’t it be cool if all of the iZotope products that you owned talked to each other? Well, it’s a
dream come true! With iZotope’s Inter Plug-in Communication (IPC) technology, different iZotope
plug-in instances on separate tracks can send data back and forth to each other.
Neutron 5 includes the following IPC functionality:
• The Masking Meter feature, included in the Equalizer module, uses IPC technology to highlight
masking occurring between tracks with IPC compatible plug-ins. See the Masking Meter
chapter for more information.
• The Assistant feature included in the Visual Mixer plug-in uses IPC technology to provide a
starting point for your mix by grouping and adjusting levels of IPC compatible plug-ins in your
session. See the Assistant chapter for more information.
4. General Controls
The general controls in Neutron can affect the entire plug-in or individual modules only.
The following general controls affect the entire plug-in:
• Resize Window
• Global Controls
• Signal Chain
• I/O Panel
The following controls affect individual modules:
• Multiband Crossover Spectrum View
• Detection Filter View
• LFE (Low-frequency effects)
Resize Window
You can resize the main window by clicking and dragging the bottom right corner of the plug-in
window. The Neutron 5 mothership, Visual Mixer, and component plug-ins are all resizable.
Global Controls
The following controls are included in the header area of the Neutron 5 mothership plug-in:
1. Plug-in Instance Name: Displays the name of the current instance as it appears in IPC lists in
supported iZotope plug-ins.
2. Assistant View: Opens the Assistant view. See the  Assistant chapter for more information.
3. Detailed View: Opens the Detailed View, allowing you to access deeper controls in the modules.
4. Preset Manager: Opens the Preset Manager window. See the Presets chapter for more
information.
5. Undo History: Opens the Undo History window. Undo History allows you to compare settings
you’ve adjusted. See the  Undo History Controls section below for more information.
6. Zero Latency: Enables Zero Latency processing. When enabled, some processing options will
be automatically adjusted: Disables Limiter mode selection, disables the Sculptor module,
disables the Unmask module, locks the crossover type in the multiband modules (Compressor
1 & 2, Transient Shaper, Exciter) to the “Zero Latency (Analog)” option.
7. Options: Opens the Neutron Options window. See the  Options chapter for more information.
8. Help: Opens the Neutron help documentation in your default web browser.
Undo History Controls
The Undo History window allows you to compare controls you’ve adjusted in the current Neutron
instance. You can revert settings to audition a specific parameter change by clicking on one of the
history list items. The following controls are available in the Undo History window:
Controls Description
CLEAR Clears all events from the current history list.
CLOSE Closes the History window. Processing resumes from the point you had last
selected, so you can continue building on the History list from an earlier point.
SETS You can assign up to four points in the History list to sets A, B, C, or D. This is
useful for comparing a collection of different settings at once. To assign a History
item to a Set: Select an item in the history list you want to capture. Click on the A,
B, C, or D text labels to assign the selected history item to the button. Click on the
assigned A, B, C, or D buttons to quickly toggle between set events in the history
list.
Signal Chain
You can add, rearrange, and move the following modules in the Signal Chain:
• Gate
• EQ
• Compressor (x2)
• Exciter
• Transient Shaper
• Sculptor
• Unmask
• Density
• Phase
• Clipper
Most modules can only be added to the Signal Chain once. If a module has been
added to the Signal Chain already, the option in the module list will be greyed out. Only
the Compressor module can be added to the Signal Chain twice.
Use the signal chain controls outlined in the table below to customize your Signal Chain.
Icons Control Description
Add Click the + button in the Signal Chain to open the module menu.
Select a module from the list to add it to the last slot in the
Signal Chain.
Power
Button
Click the power button the upper left corner of a module tile to
bypass processing of that module.
Module
Presets
Opens the module preset manager for the associated module.
See the Presets chapter for more information.
Remove Click to remove the associated module from the Signal Chain.
Icons Control Description
Reorder Click and drag a module panel left or right within the Signal
Chain to change its order in the signal flow.
Wet/Dry Mix Adjust the slider to balance between the dry (unprocessed) and
wet (processed) signals.
I/O Panel
The I/O (input/output) Panel allows you to monitor levels and adjust gain, stereo width and pan,
limiter settings, and channel operations.
1. Limiter: Enable to apply transparent limiting while preserving transients in the output. See 
Limiter section below for more information.
2. Gain (Input/Output): Adjusts the input or output gain. Output gain level comes before the
Limiter in the signal flow.
3. Bypass: Toggle to either turn processing on (Bypass disabled) or off (Bypass enabled). When
you toggle Bypass ON (processing disabled), you will not be able to modify module controls.
4. Sum To Mono: Toggle on to sums the left and right channels from the stereo signal into a
mono output signal.
5. Pan: Pans the output signal to the left or right channel. Only functional in stereo instances of
Neutron.
6. Invert Phase: Enable to invert the polarity of the signal.
7. Width: Adjusts the amount of stereo widening. Decreasing this control results in a narrowing
effect (-100% is equivalent to mono), increasing this control widens the apparent stereo field.
Only functional in stereo instances of Neutron.
8. Swap Channels: Enable to route the left channel to the right channel output and the right
channel to the left channel output.
Limiter
Enable to allow the BS.1770-2/3-compliant 1 True Peak Limiter to process digital loudness
maximization of your output signal while preventing True Peak overflows across all of your mono,
stereo, and surround channels.
The limiter comes after the output gain slider in the signal flow. You can use the output gain slider
to increase or decrease the level of the signal going into the limiter.
When the limiter is enabled, gain reduction activity is drawn in orange on top of the output meters.
The limiter includes the following controls:
Ceiling
Determines the maximum output level of your audio. All peaks above this point will be limited. You
can set the Ceiling of the Limiter via the Ceiling slider overlaid on the output meter, within a range
of 0 to -20 dB.
There are two ways you can adjust the Ceiling slider:
• Click and drag the Ceiling slider UP or DOWN to the desired value.
• Hover over the Ceiling readout, and click and drag the mouse UP or DOWN to the desired value.
Limiter Style
You can choose from one of three user-definable character options for more direct control over the
adaptive, transparent nature of the limiting algorithm.
Character Description
Clear The Limiter will respond more quickly in order to better present fast-moving
transient material in the mix.
Smooth Smooth is the most common, best-sounding middle ground between Clear and
Thick. It’s the most appropriate algorithm for the majority of program material,
including most vocals and dialogue.
Thick The Limiter will respond to audio more slowly, useful for louder, slower-moving
sounds like a big explosion sound effect, or a bass/low-frequency swell, where
you wouldn’t want an aggressive limiter to break the sound up.
Limiter Mode
You can configure the Limiter in four different ways using the algorithms described in the table
below. Each algorithm has a different latency that will affect the sonic quality. 
Limiting Algorithm  Latency Requirement 
IRC II 3446 samples at 48 kHz
IRC LL 120 samples at 48 kHz
Hard 198 samples at 48 kHz
Zero-L Zero Latency
Low latency is important to avoid lag or loss of sync when mixing to picture,
dealing with limited latency compensation, or a control surface that needs to remain
responsive.
Limiter LFE
Appears when Neutron is inserted on a 5.1 or 7.1 surround track. The limiter applies gain reduction
equally to all channels when the peak level of any given channel exceeds the Ceiling value. It may
be desirable to exclude the LFE channel from triggering gain reduction or from being affected by
the limiter.
• Enabled: LFE channel is included in limiter input and will be processed by the limiter.
• Disabled: LFE channel is excluded from the limiter input and not affected by limiter gain
reduction.
Vocal Unmask Controls
When Neutron is selected in the Vocal Unmask source menu in Nectar and masking is detected
by Vocal Assistant, an EQ cut curve will be applied to the output of Neutron to unmask the vocal
track. An Unmask control box will appear above the I/O meters in the Neutron interface that is
unmasking the vocal track.
Depending on the edition of Nectar you are using, different Unmask controls will be available in
Neutron:
• Using Nectar Standard edition: An Unmask EQ power button will appear in the Neutron
instance that is unmasking the vocal.
• Using Nectar Plus edition: The Unmask box in Neutron will include a power button and an
expandable advanced controls panel. The Advanced unmask controls panel includes: the
Nectar Plus instance name that Neutron is unmasking, an Unmask EQ curve display, EQ
amount control, Dynamic Unmask EQ on/off, and an external sidechain option when Dynamic
mode is enabled.
I/O Panel Meters
The Input and Output meters display Peak and RMS metering information.
• The current Peak value is displayed in white.
• The current RMS value is displayed in light grey.
The text readouts directly above the meters display the current Peak and RMS values.
Multiband Crossover Spectrum View
You can use the Multiband Crossover Spectrum View to select, adjust, and audition
processing bands in mulitband modules. The following modules include multiband processing:
Compressor , Exciter , Gate , Clipper, Density and Transient Shaper. Each multiband module
supports up to three adjustable processing bands.
Icons Control Description
ADD To add Crossover Cutoff nodes, hover over the Crossover
Cutoff node bar and click on the + button that appears. You
can add up to 3 crossover regions.
Icons Control Description
REMOVE To remove Crossover Cutoff nodes, hover over the band area
and click the x button.
POWER
BUTTON
Toggle ON/OFF to enable/disable processing for the cutoff
section.
SOLO Enable to hear only the band selected.
Adjusting Crossover Cutoffs
You can manually adjust the multiband crossover points in the crossover spectrum view using the
following methods:
• CLICK & DRAG CUTOFF HANDLES
1. Hovering over the crossover handle.
2. Left-click and drag the handle left or right to the desired position.
3. Use the frequency readout at the bottom of the handle while dragging as a reference to
where the crossover point is in relation to frequency.
• ENTER TEXT INPUT
1. Double-click on a crossover handle to open the readout as a text edit field.
2. Type the desired frequency value for the crossover cutoff into this field.
3. Hit the enter or return key to update the value.
Crossover cutoff points are not shared across multiband modules. Adjusting a
crossover point in one module will not affect the crossover points in other multiband
modules.
Detection Filter View
Enable the Detection Filter to adjust the frequency response of the detection circuit in the
Compressor or Gate modules. When the Detection Filter is active, you can access the controls
outlined below.
When enabled, the Detection Filter gives you access to the following controls:
Icon Control Description
Power Button Toggle ON to enable the Sidechain Filter. By default the
Detection Filter is OFF.
Icon Control Description
Solo Enable to audition the output of the Detection Filter. This
can be useful to enable when adjusting the Detection Filter
nodes.
Resonant Filter
Nodes
Adjusts gain and center frequency in lowpass bands and
highpass bands.
Resonant Filter Node Adjustments
The Resonant Filter Nodes are displayed within the the Detection Filter view. You can use these to
tailor your frequency response:
• Click and drag the resonant filter nodes UP or DOWN to increase or decrease gain.
• Click and drag the resonant filter nodes LEFT or RIGHT to adjust the center frequency.
Making adjustments to the Detection Filter allows you to tailor the sensitivity of the
Compressor to different frequencies. This is useful when using the Compressor in
single band mode.
For example: If you want the Compressor to react more to sibilant or harsh
frequencies rather than low-frequency content, you can filter out low frequencies
using the high-pass filter and boost sibilant frequencies using the resonant low-pass
filter to adjust the signal that the Compressor treats as the input signal.
LFE (Low-frequency effects)
The LFE (Low-Frequency Effects) button only appears when Neutron is loaded on 5.1 or 7.1
surround tracks. LFE For more information on surround sound support, see the Surround Sound
section below.
You can find the LFE button for modules in the module header.
• Enable to include LFE in the audio processing. This is the default setting.
• Disable the LFE button to exclude low frequencies when passing audio through the Low
Frequency Effects (LFE) channel with the relative latency compensation.
LFE Rolloff Filter
If you are mixing to a surround sound specification that requires a band-limited LFE signal, the
24 dB/octave LFE rolloff filter helps you achieve this. You can enable the filter and select a cutoff
slope value in the Options under the Metering Options.)
This option only appears in the Options when Neutron is instantiated on a 5.1 or 7.1
surround track.
Surround Sound
Neutron supports the following surround sound formats in the following hosts. Neutron processes
all channels equally unless LFE processing is bypassed in any particular module.
DAW Surround Format Channel Configurations
Pro Tools Film 1.0, 2.0, 3.0 (LCR), 4.0 (Quad), 5.0, 5.1, 7.0, 7.1
Logic Pro DTS, ITU/SMPTE,
SDDS
1.0, 2.0, 4.0 (Quad), 4.0 (LCRS), 5.1 (ITU/SMPTE)
Cubase ITU/SMPTE 1.0, 2.0, 3.0 (LRC), 3.0 (LRS), 4.0 (Quad), 4.0 (LCRS), 5.0,
5.1
Nuendo DTS, ITU/SMPTE,
SDDS
1.0, 2.0, 4.0 (Quad), 4.0 (LRCS), 5.0, 5.1, 7.0 (cine), 7.0
(music), 7.1 (cine), 7.1 (music)
Surround Sound configuration in Neutron includes the LFE button and surround sound
meters in the I/O panel.
5. Assistant
Neutron 5 includes an Assistant that helps you achieve your creative intent for individual elements
of your mix, helping you finish your project with confidence. The Assistant works together with the
Assistant View and Detailed View to help you make broad adjustments early in your workflow and
refine your choices as you get deeper into your mix. We highly encourage you to use the Assistant
in the Neutron mothership plug-in for individual track processing or use the Assistant in the Visual
Mixer plug-in for a multiple track starting point.
Assistant: Neutron mothership plug-in
Neutron’s Assistant in the mothership plug-in helps you make broad mixing decisions early in your
mix workflow with streamlined control and visual aids to help you reach your outcomes fast.
Recommended Assistant Workflow: Neutron mothership plug-in
To access the Assistant, click the Assistant button in Neutron’s header.
This will begin listening to the input signal and generate a starting point for your track. Once
analysis is completed, the Assistant view will become available.
The Assistant view is a real-time environment that works with the detailed controls included in the
modules present the module chain.
Assistant View Interface
The following image outlines the key sections of the Assistant View:
1. Intent Controls 
2. Target Library 
3. Meters and Displays 
Assistant Controls
The controls on the Assistant Page allow for broad control over early decisions in your mixing
workflow. They work together with Neutron’s intelligent analysis, Targets and the Signal Chain to
give you a simple workflow for tonal, dynamics, character, and width decisions in your mix. Intent
Controls are exclusive to the Assistant View in the mothership plug-in and are not available in the
Neutron component plug-ins or the Visual Mixer plugin.
Assistant controls are linked to deeper controls in the Detailed View of the mothership plug-in. Here
is what each intent control is mapped to in the Detailed View:
Assistant Page Parameter Connected Module Control
Equalizer Equalizer Mix (found in the module tile in the Signal Chain)
Sculptor Sculptor Amount
Density Density Range
Compressor Compressor Mix (found in the module tile in the Signal
Chain)
Drive Exciter Drive
Processing Mode (Classic/
Trash)
Exciter Processing Mode
XY Pad Exciter XY Pad
Tone Exciter Tone
Width Amount Width (found in the I/O Panel)
Tone
• Equalizer Controls the Mix parameter of the Equalizer module. Neutron's Track Assistant
intelligent analyzes the input signal and sets the shape of the EQ module. You can increase
or decrease the effect of this processing with this control.
• Sculptor This parameter adjusts the amount of spectral tone shaping aimed at matching the
selected target curve. The target curves are the idealized tonal of the selected instrument
based off analysis of thousands of professional mixes.
Dynamics
• Density: Adjusts the Range of the upward compression applied as signal falls below the
threshold in the Density module. 
• Compressor: Adjusts the Mix of the Compressor module. 
To learn more about Dynamics in Neutron, go to the Compressor and Density chapters.
Saturation
• Drive: Adjusts the Drive parameter for all three bands in the Exciter module. Adjusts the amount
of distortion applied to the input signal.
• Processing Modes: Adjusts the processing mode for all three bands in the Exciter module. The
processing mode in the Exciter changes the style of distortion between subtle and dramatic
harmonic profiles per band. Classic processing mode (top) provides four modes for subtle
excitation use cases. Trash processing mode (bottom) provides four modes for dramatic
distortion use cases.
• XY Pad: Controls the XY pad for all three bands in the Exciter module. Blends different
harmonic profiles to achieve the sound you want to hear.
• Tone: Adjusts the Tone control in the Exciter module. Tone adjusts the balance of distortion
applied to low and high frequency content in the Exciter. Values between -100 and 0 emphasize
low frequency content; Values between 0 and 100 emphasize high frequency content.
To learn more about the harmonic profiles in Neutron, go to the Exciter chapter.
Width
Adjusts the global Width control in the I/O panel of the Neutron mothership plug-in.
To learn more about the I/O panel, go to the General Controls chapter.
Target Library
The Target Library contains instrument targets and user generated reference targets. Setting a
target provides helpful starting points for the Intent controls in the Assistant View and the modules
in signal chain in the Detailed View.
Instrument Targets
The Tonal Balance Targets are directly connected to the Sculptor module in the Detailed View.
Changing a Target in the Assistant changes the Target Curve Menu in the Sculptor module. This
dramatically changes the sound of the processing applied to the input signal.
Dirty State
Targets will enter a dirty state when the original settings for the Target have been modified in the
Detailed view. Selecting this button will restore the original settings.
When a Target enters a dirty state it means that changes have been made that are
outside assistant-recommended settings.
Reference Targets
You can create and manage your own custom reference targets by importing audio files from your
computer.
Press the (+) button to open a system dialog and select audio files on your computer to add to your
custom Target Library.
Selecting a sound, clip, or stem will copy the name and that file into the Custom target area of
Neutron’s Target Library.
Meters and Displays
Tonal Balance Target Metering
The Tonal Balance Target Meter displays audio as a frequency spectrum, providing a helpful
visualization of the selected Instrument Target’s intended shape against the output signal.
Switching targets will change the shape of the Tonal Balance Target Meter.
The thin gray line represents the output signal of Neutron, visualizing what the input signal looks
like after it’s passed through the module chain in Neutron.
Relearn
Select this to re-run the Assistant and analyze new audio. 
Assistant: Visual Mixer plug-in
The Assistant in Visual Mixer helps you automatically set static level in all the tracks with Neutron
5 mothership, Neutron 5 components, and Relay. For best possible results, use the Assistant in
Visual Mixer after you’ve imported raw stems (tracks) into a new session.
• You can access the Assistant from the Neutron 5 Visual Mixer plug-in.
• The Assistant can listen to and adjust the following IPC-compatible iZotope plug-ins: Neutron
5 mothership, Neutron 5 Compressor, Neutron 5 Equalizer, Neutron 5 Exciter, Neutron 5 Gate,
Neutron 5 Transient Shaper, Neutron 5 Sculptor, Neutron 5 Unmask, and Relay.
The table below outlines which plug-ins are compatible with the Assistant in Visual Mixer.
Recommended Workflow: Visual Mixer plug-in
The Assistant in Visual Mixer helps you automatically set static level in all the tracks with Neutron
5 mothership, Neutron 5 components, and Relay. For the best possible results, use the Assistant in
Visual Mixer after you’ve imported raw stems (tracks) into a new session.
Before you run the Assistant in Visual Mixer, check that the DAW faders are set to
unity gain, i.e. don’t touch your DAW faders. The less you have set up, the easier it is
for the Assistant in Visual Mixer to help you.
If you want Visual Mixer (exclusively) to set all your pans and faders, make sure to put Relay in the
last insert on your tracks.
1. Import all tracks needed for your session. The more tracks you include, the more time the
Assistant will save you!
2. Add Visual Mixer on your master bus. Know that Visual Mixer does not process audio, it just
needs to know at least that there is activity occurring.
3. Click on the Assistant button in Visual Mixer and begin using the Assistant.
Visual Mixer Assistant Stages
The Assistant in the Visual Mixer involves the following stages:
1. Setup
2. Waiting
3. Listening
4. Audition and Adjust
5. Accept
In each stage, you need to perform an action that will help the Assistant provide you the most
accurate results.
Use buses or individual tracks but don’t use both. While the Assistant can work on
buses and individual tracks, you only need to exclusively use either buses or individual
tracks. If you have Neutron 5 and Relay on the same track, you should only select one
of these to represent the track.
Make sure you are using either individual tracks or buses. The Assistant was not
designed to work well with both individual tracks and buses simultaneously.
Try setting your faders to unity gain and pan your tracks to center.
Check that the appropriate plug-ins set for Focus in the Setup stage.
If you have more than one iZotope plug-in on any individual track or bus, make sure
you select a single plug-in instance per track in the Setup stage.
Setup Stage
Select the tracks that are the focus of your mix and those that you want to include. Then, click
Begin Listening.
This view lists all of the compatible iZotope plug-ins in your session. Make sure every track you
want to include is represented and only included once. Do NOT play music during this stage!
You need to pick at least one focus of your mix. You cannot proceed to the next
stage until you have done this. The focus is one instrument that you feel is the
most important aspect of your mix. Many tracks can be the focus of your mix, for
example, if there are two lead vocal tracks. However, if everything is the focus, then
the Assistant will not yield great results.
Waiting Stage
Place the playhead at the beginning of your arrangement. Then, start the transport for the
Assistant to begin listening.
The Assistant can’t do anything without listening to your music. So, make sure you play your audio
from where your audio starts wherever you want the Assistant to begin listening.
If your transport is playing when you enter the Listening page, the Assistant will not
begin listening automatically. You need to stop your audio and start the transport at
the beginning of the song for best results. If using a large session, there may be a
slight delay, try to start, rewind, and restart again.
Listening Stage
When you reach the end of your session, click Go To Results to proceed to the results. If you don’t,
the Assistant will never stop listening.
The Assistant listens to the overall level of each audio source and categorizes each instrument into
groups.
Audition And Adjust Stage
Now that the Assistant has listened and has categorized your audio, you can now:
• Audition the Assistant’s suggestions.
• Adjust the Group Sliders to what sounds best to you.
• Compare the Assistant’s results with your original session by clicking on the Bypass Assistant
button.
• Edit the classifications of the Group Sliders and the Focus.
Group Sliders
Adjust the Group Sliders to your preference and audition the differences.
The group sliders are created as a result of the Assistant listening to your audio. The Assistant
gathers up all the information it has learned about your music and it sub-mixes these into the
groups.
The Assistant determines a target level for the following groups:
• Focus: What you choose as the focus of your mix.
• Voice: Tracks selected with vocals.
• Bass: Tracks selected with bass.
• Percussion: Tracks selected with drums/percussion instruments.
• Musical: Other tracks that may not relate to the groups above.
Each group has an associated, adjustable level slider. The slider itself represents the overall gain
differences of the groups relative to each other. When you adjust these sliders, you are making gain
changes relative to the Assistant’s initial target level suggestion. The Assistant will try to apply
gain adjustment to each track within that group so that their combined levels achieve the target
mix level set by the Group Slider. The range of adjustment is +/- 12 dB for the Group Sliders.
If you don’t like the way your mix sounds with the group sliders at their starting
positions, they are not final– you can always experiment until you get the right level
balance for your song.
Group Sliders will be disabled if there is no content recognized for that group. If all
your audio sources are selected as the Focus, then only one slider (Focus slider) will
be available. With that, any audio source that is not used or classified is disabled.
Bypass Assistant
This button will disable the sliders and allow you to listen to your session pre-Assistant
suggestions.
When auditioning the Assistant’s results, the unprocessed mix will be gain-matched to the
processed mix. By gain matching, you can better discern the differences in balance.
To avoid clipping, we try to turn things down when trying to go for an overall mix, so
the levels that Mix Assistant suggests may be lower than the original levels.
Edit
Edit which tracks are categorized for each Group by clicking on the Edit Classifications button
in the lower right-hand corner. You can adjust the tracks in focus or reclassify the tracks. The
Assistant adjusts the Groups to reflect your categorization decisions.
Any plug-ins that you did not select in the Setup stage will not appear in the Assistant’s
plug-in list editor. You cannot add any plug-ins to that list. Additionally, if you add a
compatible iZotope plug-in to your session while the Assistant was in the Learning
stage, it will not show up in the plug-in editor.
Accept Stage
When you’re happy with the level balance of your mix, click Accept and your level settings will be
applied to each source plugin using iZotope’s Inter-plugin Communication Technology (IPC).
• If you didn’t like results, close out of the Assistant window to revert the changes.
• If you auditioned the results, you can’t click Accept unless you disable Bypass Assistant.
You can see the adjustments made to the output gain sliders in all affected plug-ins
shown in the results list. These changes are easiest to view in the Visual Mixer
component plug-in.
Once you close out of the Assistant, you cannot go back to the same screen to make
group level changes. To make any Group Level changes, you will have to restart the
Assistant from the beginning. The Assistant will re-learn everything unless you have
overwritten a class which we will not alter.
6. Gate
You can use the Gate module to eliminate or attenuate unwanted signal content when the input
signal falls below a given threshold level.
Module Interface
The Gate module includes the following sections:
1. Module Header
2. Meters and Displays
3. Controls
Module Header
The controls in the module header affect the entire Gate module.
1. Delta: Monitors the difference in the signal before and after the Gate module, enabling you to
hear exactly how the module is changing your sound. 
2. Multiband Crossover Spectrum View: Access the Multiband Crossover view and controls. See
the Multiband Crossover Spectrum View section in the General Controls chapter.)
3. Detection Filter View: Access the Detection Filter view and controls. 
4. Learn: Enable to allow Neutron to search for natural crossover cutoff points for multiband
processing using a few criteria, including identifying minima in the frequency spectrum of the
incoming audio. When it has determined and set the ideal values for the crossover cutoffs, it
will turn itself off automatically. You can also manually disable learning when it is active by
clicking the Learn button again.
5. Reset: Returns all controls in the Gate module to their factory default values. If you wish to
return to settings you were using before clicking the Reset button, you can use the Undo History
window to revert to the settings before the Reset event.
6. LFE: (Not pictured, surround instances only.) This option appears when Neutron is inserted on a
5.1 or 7.1 surround track. When enabled, the LFE channel will be processed along with all other
channels. When disabled, the LFE channel will not be processed by the associated module. If
necessary, latency compensation is applied to the LFE channel when it is disabled, to ensure
timing is maintained between all channels.
Meters and Displays
The meters illustrate how the Gate is responding to and processing the input signal. The meters
included are outlined in the image below.
1. Waveform Displays
• Scrolling waveform: displays the amplitude of the input and output signals over time. The
meter scrolls from right to left, with the most recent information on the right.
• Input signal waveform: dark gray waveform displayed behind the output signal waveform.
• Output signal waveform: light gray waveform displayed in front of the input signal
waveform. When the signal is gated, you can monitor the difference in the gain reduction
applied to the output signal versus the input signal.
2. Gain Reduction Trace
Draws a line that represents the gain reduction applied to the selected band over time. Use the
Gain Reduction Trace to monitor and to set the response times (attack and release) and gain
reduction envelope applied over time.
Controls
Threshold Controls
You can control gating by setting the Open Threshold and Close Threshold. Click and drag the
Threshold handles and place them where you want to apply gating.
• Open Threshold: Sets the level above which the gate will open, allowing the signal to pass
through. When the input signal falls ABOVE the Open threshold level, attenuation will stop.
• Close Threshold: Set below the Open threshold level at which the gate will close. This is also
called hysteresis. When the input signal falls BELOW the Close threshold, it will be attenuated.
Moving the Close threshold either UP or DOWN will affect your gating. By setting Close
threshold lower than Open threshold, more of the decay will pass without affecting the trigger
threshold.
In some situations, undesirable signals that are near thelevel of the open threshold
can cause the gate to “chatter” by crossing the threshold level too often. The Close
threshold helps to eliminate this chattering effect. When a signal has dropped below
the Close threshold, it will not trigger the gate to open again until it exceeds the level of
the Open threshold.
HUD Controls
The HUD in the Gate Module includes:
• Ratio: Determines the amount of gain reduction applied to signals that fall below the Threshold.
• Attack: Determines the amount of time (in milliseconds) it takes for the gate to transition from
closed to open when a signal exceeds the Open threshold.
• Hold: Sets the amount of time (in seconds) the gate will stay fully open after a signal falls below
the threshold. The hold length will vary when the release period begins.
• Release: Determines the amount of time (in milliseconds) it takes to transition from open to
closed when a signal falls below the Close threshold.
• Gain Reduction Meter: Displays the current average amount of gain reduction in decibels (dB)
applied to the signal.
Advanced Controls
The Sidechain controls for the currently selected band are located in the Advanced panel of the
HUD. To access the Advanced Panel, click the arrow button on the right hand side of the band
HUD.
Sidechain
Allows you to trigger the amount of gain reduction in the Gate from a signal other than the input
to the Gate. The signal is routed into the detection circuit of the Gate. You can choose either an
internal or external input signal to trigger the Gate band’s dynamic behavior. By sidechaining, you
can dynamically link elements of a mix to provide an adaptive balance between tracks.
Enabled Sidechain
When you enable Sidechain, you have the option to sidechain with an internal band or an
external band. The sidechain dropdown menu will display active internal bands and active external
instances categorized under internal or external as described in the list below.
• INTERNAL (INT.):
• Choose from any band currently placed in the Gate module.
• Using an internal sidechain input allows you to trigger gain reduction in the selected band
from the amount of energy in a different band. For example, you can accentuate perceived
low end energy by reducing high end any time the lowest band exceeds a defined threshold.
• Internal Full allows you to trigger gain reduction taking the sonic information from all active
bands.
• EXTERNAL (EXT.):
• Choose from any audio from another track or bus.
• Using an external sidechain input will help balance a signal with other tracks.
• The external audio source can also be filtered through any of the bands in the Gate module
by choosing any of the External bands (for example, Ext. Band 1).
  `,
};
