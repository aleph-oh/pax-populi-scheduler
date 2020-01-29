"""
Runs one round of scheduling.
"""
#print('We did it!, this is fun')
#print('Reached line 6')
from scheduler import Scheduler
#print('Reached line 8')
import argparse
#print('Reached line 10')
import string_parser
#print('Reached line 12')
import json
#print('Reached line 14')
from datetime import datetime
from availability import Availability
from user import User

def run_scheduler(registrations):
    """
    Runs the scheduler and prints a json containing a list of schedule objects
    to be written to the database.
    """

    # Convert registrations dict to students, tutors
    students = []
    tutors = []
    for registration in registrations:
        reg_id = registration['_id']
        availability = Availability.from_dict(registration['availability'])
        gender_preference = registration['genderPref']
        courses = registration['courses']
        earliest_start_date_str = registration['earliestStartTime']
        earliest_start_date = datetime.strptime(earliest_start_date_str, '%Y-%m-%d').date()
        user_dict = registration['user']
        user_id = user_dict['_id']
        gender = user_dict['gender'].upper()
        tz_string = user_dict['timezone']
        user_type = user_dict['role'].upper()
        user = User(user_id, reg_id, user_type, gender, gender_preference,
                    availability, tz_string, courses, earliest_start_date)
        if user_type == 'STUDENT':
            students.append(user)
        if user_type == 'TUTOR':
            tutors.append(user)
        #print(students, tutors)
    # Run scheduler
    scheduler = Scheduler(students, tutors)
    schedule_dicts = scheduler.schedule_dicts_for_database()
    # print instead of return because python-shell receives this data from Python stdout
    print json.dumps(schedule_dicts)
    #print(json.dumps(schedule_dicts), "json.dumps")
    #print "main.py complete!"
def main():
    #print('We have reached main')
    parser = argparse.ArgumentParser()
    parser.add_argument("registrations",
                        type=string_parser.json_loads_byteified,
                        help="a list of unmatched registrations") 
    args = parser.parse_args()
    run_scheduler(args.registrations)

if __name__ == '__main__':
    #print("started main.py")
    main()
