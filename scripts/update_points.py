import json
import os
import sys

POINTS_FILE = "points.json"

EVENT_POINTS = {
    "push": 5,
    "pull_request": 10,
    "issues": 7,
    "issue_comment": 3
}

def load_event(file_path):
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f" Failed to load event file: {e}")
        sys.exit(1)

def load_points():
    if os.path.exists(POINTS_FILE):
        with open(POINTS_FILE, "r") as f:
            return json.load(f)
    return {}

def save_points(data):
    with open(POINTS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def get_actor_username(event):
    username = event.get("sender", {}).get("login", "")
    if not username:
        print(" Could not extract username from event.")
        sys.exit(1)
    print(f"👤 GitHub Actor: {username}")
    return username

def get_event_type():
    event_type = os.getenv("GITHUB_EVENT_NAME", "unknown")
    print(f"📦 GitHub Event: {event_type}")
    return event_type

def main():
    if len(sys.argv) != 2:
        print("Usage: python update_points.py <event.json>")
        sys.exit(1)

    event_data = load_event(sys.argv[1])
    event_type = get_event_type()
    username = get_actor_username(event_data)

    points = load_points()
    current = points.get(username, 0)
    earned = EVENT_POINTS.get(event_type, 0)

    print(f"✨ {username} earned {earned} points for {event_type}")
    points[username] = current + earned
    save_points(points)
    print(f"✅ Total for {username}: {points[username]}")

if __name__ == "__main__":
    main()
