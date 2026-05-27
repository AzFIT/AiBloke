# Plan: The Bloke AI — Workout Program Animated Video

## Goal
Create a 10-second animated UI video based on the Dribbble "Running App Micro Interaction" design, repurposed for The Bloke AI workout program feature.

## Design Reference
- Dribbble: Abron Studio's Running App Micro Interaction
- Blue gradient background (dark navy to bright blue)
- Dark rounded rectangular buttons with subtle depth
- Clean white modern typography (SF Pro / Inter style)
- iPhone frame mockup

## Animation Sequence (10 seconds)
1. **0.0s - 0.5s**: Static screen showing "Phase 2, Week 2, Day 2" title + 4 day buttons
2. **0.5s - 1.5s**: Idle state with subtle ambient animation
3. **1.5s**: Tap/press on Day 1 button (scale pulse + highlight)
4. **1.5s - 2.2s**: Day 2, 3, 4 buttons fade out and drop downward
5. **2.2s - 3.5s**: Day 1 button expands upward to fill screen
6. **3.5s - 10.0s**: Expanded workout detail view with exercise table and video placeholders

## Technical Approach
- Build with Python (PIL + moviepy) for precise frame control
- 1080x1920 portrait (9:16) at 30fps
- Smooth ease-in-out transitions using interpolation

## Deliverable
- MP4 video file: /mnt/agents/output/bloke_workout_program.mp4
