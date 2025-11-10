import subprocess
import datetime
import os
import random

commit_messages = [
    "Refactor API response handling",
    "Fix mobile navbar visibility",
    "Optimize profile page loading",
    "Clean up unused authentication code",
    "Simplify form validation logic",
    "Fix blank search results bug",
    "Update user permissions model",
    "Refactor homepage for mobile",
    "Fix unread notification issue",
    "Resolve form submission delay",
    "Optimize database query performance",
    "Improve UI consistency across pages",
    "Fix settings page save bug",
    "Improve footer responsiveness on mobile",
    "Refactor error handling in API",
    "Refactor routing logic",
    "Fix session timeout handling bug",
    "Improve search feature performance",
    "Resolve duplicate email notifications",
    "Fix modal close issue on click outside",
    "Improve login form accessibility",
    "Refactor file structure for easier navigation",
    "Fix checkbox state saving issue",
    "Optimize API calls to reduce traffic",
    "Fix loading animation issue",
    "Fix date formatting in settings",
    "Improve error handling on form submissions",
    "Update avatar upload functionality",
    "Fix mobile table sorting issue",
    "Resolve broken image links in docs",
    "Add descriptive error messages",
    "Optimize background tasks performance",
    "Fix user activity log display issue"
  ]

def add_commit_on_specific_dates():
    # Define dates in various formats for flexibility
    dates_to_commit = [
        {"year": 2025, "month": 11, "day": 10, "hour": 13, "minute": 20},
    ]
    
    commit_dates = parse_dates(dates_to_commit)
    
    for commit_date in commit_dates:
        try:
            commit_date_str = commit_date.strftime('%Y-%m-%d %H:%M:%S')
        
            commit_message = f"{random.choice(commit_messages)}"
            
            # Check if we can add files to git
            if not run_git_command(["git", "add", "."]):
                print("Failed to add files to git staging area. Skipping this date.")
                continue
                
            env = os.environ.copy()
            env["GIT_COMMITTER_DATE"] = commit_date_str
            
            # Try to commit
            if not run_git_command(
                ["git", "commit", "--date", commit_date_str, "-m", commit_message],
                env=env
            ):
                print(f"Failed to commit for date {commit_date_str}. Skipping this date.")
                continue
            
            # Try to push
            if not run_git_command(["git", "push", "origin", "main"]):
                print(f"Failed to push commit for date {commit_date_str}. Stopping execution.")
                break
            
            print(f"Successfully committed for date: {commit_date_str} - {commit_message}")
            
            # Add a small delay to avoid Git issues
            import time
            time.sleep(2)
            
        except Exception as e:
            print(f"An unexpected error occurred for date {commit_date}: {e}")
            # Continue with the next date

def run_git_command(command, env=None):
    """Run a git command and return True if successful, False otherwise."""
    try:
        if env:
            subprocess.run(command, check=True, env=env)
        else:
            subprocess.run(command, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Git command error: {e}")
        return False

def parse_dates(date_list):
    """Convert various date formats to datetime objects"""
    result = []
    
    for date_item in date_list:
        if isinstance(date_item, datetime.datetime):
            # Already a datetime object
            result.append(date_item)
        elif isinstance(date_item, dict):
            # Dictionary format with year, month, day, etc.
            result.append(datetime.datetime(
                date_item.get("year", 2025),
                date_item.get("month", 1),
                date_item.get("day", 1),
                date_item.get("hour", 0),
                date_item.get("minute", 0)
            ))
        elif isinstance(date_item, str):
            # String format - try multiple formats
            try:
                # Try the standard format first
                result.append(datetime.datetime.strptime(date_item, '%Y-%m-%d %H:%M'))
            except ValueError:
                try:
                    # Try parsing with single-digit days/months
                    if len(date_item.split('-')) == 3:
                        year, month_part, rest = date_item.split('-')
                        if ' ' in rest:
                            day_part, time_part = rest.split(' ', 1)
                            
                            # Convert parts to proper format with leading zeros
                            month = month_part.strip().zfill(2)
                            day = day_part.strip().zfill(2)
                            
                            reformatted_date = f"{year}-{month}-{day} {time_part}"
                            result.append(datetime.datetime.strptime(reformatted_date, '%Y-%m-%d %H:%M'))
                        else:
                            print(f"Invalid time format in: {date_item}")
                    else:
                        print(f"Could not parse date string: {date_item}")
                except Exception as e:
                    print(f"Error parsing date {date_item}: {e}")
    
    return result

if __name__ == "__main__":
    add_commit_on_specific_dates()