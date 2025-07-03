from __future__ import annotations
import os
from moviepy import VideoFileClip, TextClip, CompositeVideoClip, concatenate_videoclips


def create_montage(video_segments, output_path: str = "montage.mp4", fade_duration: float = 0.5):
    """Create a montage from a list of video segments.

    Parameters
    ----------
    video_segments : list of dict
        Each dictionary must contain:
        - 'file': path to the video clip
        - 'caption': text to overlay on that clip describing improvements
    output_path : str
        Path where the montage video will be saved.
    fade_duration : float
        Duration of the fade transition between clips in seconds.
    """
    clips = []
    for segment in video_segments:
        path = segment["file"]
        caption = segment.get("caption", "")
        clip = VideoFileClip(path)
        if caption:
            # Create a semi-transparent text overlay
            txt_clip = TextClip(caption, fontsize=24, color="white")
            txt_clip = txt_clip.set_position(("center", "bottom")).set_duration(clip.duration)
            clip = CompositeVideoClip([clip, txt_clip])
        clips.append(clip)

    # Add crossfade transitions
    final = clips[0]
    for clip in clips[1:]:
        final = concatenate_videoclips([final, clip], method="compose", padding=-fade_duration)

    final.write_videofile(output_path, codec="libx264")


def load_segments(video_dir: str = "videos") -> list[dict[str, str]]:
    """Return segments for versions 1..6 and final if the files exist."""
    segments = []
    for i in range(1, 7):
        path = os.path.join(video_dir, f"battleship_v{i}.mp4")
        if os.path.exists(path):
            segments.append({"file": path, "caption": f"Version {i}"})
    final_path = os.path.join(video_dir, "battleship_final.mp4")
    if os.path.exists(final_path):
        segments.append({"file": final_path, "caption": "Final Version"})
    return segments


if __name__ == "__main__":
    segments = load_segments()
    if not segments:
        raise SystemExit("No video segments found in the 'videos/' directory.")
    create_montage(segments)
