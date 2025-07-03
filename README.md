# Battleship

This repository contains example code to create a video montage of gameplay improvements across different versions of the game.

## Montage Script

`montage.py` combines individual video clips into a single montage. It automatically looks for clips named `battleship_v1.mp4` through `battleship_v6.mp4` and `battleship_final.mp4` in the `videos/` directory.

### Requirements

- Python 3
- [`moviepy`](https://zulko.github.io/moviepy/) library

Install the dependency with:

```bash
pip install moviepy
```

### Usage

Place your recorded clips in a folder called `videos/` using the naming
convention above and run:

```bash
python3 montage.py
```

The resulting `montage.mp4` will contain a simple crossfaded sequence of your gameplay videos with captions showing the version number.

## Browser Montage

Alternatively, open `montage.html` in any modern browser. It attempts to play the
same `battleship_v1.mp4` … `battleship_final.mp4` clips from the `videos/`
directory. Clips that are missing are skipped automatically. Each segment is
displayed with a short caption and a fade transition between videos.
