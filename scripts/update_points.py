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
        print(f"Failed to load event file: {e}")
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
    username = event.get("sender", {}).get("login", "unknown")
    print(f"👤 Actor username: {username}")
    return username

def get_event_type():
    event_type = os.getenv("GITHUB_EVENT_NAME", "unknown")
    print(f"📦 GitHub Event Type: {event_type}")
    return event_type

def main():
    if len(sys.argv) != 2:
        print("Usage: python update_points.py <event.json>")
        sys.exit(1)

    event_file = sys.argv[1]
    event_data = load_event(event_file)
    event_type = get_event_type()
    username = get_actor_username(event_data)

    if username == "unknown":
        print("❌ Could not determine username. Exiting.")
        sys.exit(1)

    points = load_points()
    current_points = points.get(username, 0)
    earned = EVENT_POINTS.get(event_type, 0)

    print(f"✨ {username} earned {earned} points for {event_type}")
    points[username] = current_points + earned

    save_points(points)
    print(f"✅ Updated total: {points[username]}")

if __name__ == "__main__":
    main()
