# In-memory store for user preferences (to be replaced with a database later)
user_preferences = {
    "user123": {"databaseLocation": "default"}  # Default user for testing
}

def get_user_preferences(user_id: str) -> dict:
    """
    Get the preferences for a given user.
    """
    return user_preferences.get(user_id, {"databaseLocation": "default"})

def update_user_preferences(user_id: str, preferences: dict) -> dict:
    """
    Update the preferences for a given user.
    """
    if user_id not in user_preferences:
        user_preferences[user_id] = {"databaseLocation": "default"}
    user_preferences[user_id].update(preferences)
    return user_preferences[user_id]