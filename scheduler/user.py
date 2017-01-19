import pytz
from datetime import datetime
from match import Match

"""
Represents a student or tutor.
"""

class User:
    def __init__(self, ID, user_type, gender, gender_preference, availability,
                 tz_string, city_ID, courses, earliest_start_date):
        """
        Args:
            ID: A string representing the user's ID. Must uniquely identify a
                user.
            user_type: A string that must be one of 'STUDENT' or 'TUTOR'.
            gender: A string that must be one of 'MALE' or 'FEMALE'.
            gender_preference: A string that must be one of 'MALE', 'FEMALE',
                'NONE'.
            availability: An Availability object representing the user's weekly
                availability in his timezone.
            tz_string: A string representing a timezone in the pytz database.
            city_ID: A string representing the ID of the city that user lives in.
            self.earliest_start_date: A date object representing the earliest
                date that the user can start a class in the user's timezone.
            courses: A list of course names (strings) that the user can be in.
            earliest_start_date: A date object representing the earliest
                possible start date for a class in the user's timezone
                (earliest start datetime is 00:00 on earliest_start_date).

        """
        if user_type not in ['STUDENT', 'TUTOR']:
            raise ValueError('user_type must be "STUDENT" or "TUTOR"')
        if gender not in ['MALE', 'FEMALE']:
            raise ValueError('gender must be "MALE" or "FEMALE"')
        if gender_preference not in ['MALE', 'FEMALE', 'NONE']:
            raise ValueError('gender_preference must be "MALE", "FEMALE", or "NONE"')
        if tz_string not in set(pytz.all_timezones):
            raise ValueError('tz_string must be in the pytz timezone database')
        self.ID = ID
        self.user_type = user_type
        self.gender = gender 
        self.gender_preference = gender_preference
        self.availability = availability
        self.tz_string = tz_string
        self.city_ID = city_ID
        self.tz = pytz.timezone(tz_string)
        self.courses = courses
        self.courses_set = set(self.courses)
        self.earliest_start_date = earliest_start_date

    def get_earliest_start_dt_UTC(self):
        """Returns a naive UTC datetime of the earliest start datetime during
        which the user can start a class.

        Returns: A naive datetime object representing the earliest datetime
        in UTC for self to start a class.
        """
        earliest_start_dt = datetime.combine(self.earliest_start_date, datetime.min.time())
        earliest_start_dt_localized = self.tz.localize(earliest_start_dt)
        earliest_start_dt_UTC = earliest_start_dt_localized.astimezone(pytz.UTC).replace(tzinfo=None)
        return earliest_start_dt_UTC

    def shared_class_start_indices(self, other_user):
        """Computes indices of Availability.SLOT_START_TIMES during which both
        users are free to start class.

        Args:
            other_user: A User object.

        Returns:
            A list of indices into Availability.SLOT_START_TIMES for which self
                and other_user are both free to start class.
        """
        return self.availability.shared_class_start_indices(other_user.availability)

    def shared_class_start_times(self, other_user):
        """Computes weekly times during which both users are free to start
        class.

        Args:
            other_user: A User object.

        Returns:
            A list of WeeklyTime objects during which self and other_user are
                both free to start class.
        """
        return self.availability.shared_class_start_times(other_user.availability)

    def share_course(self, other_user):
        """Determines whether or not two users share at least one course.

        Args:
            other_user: A User object.

        Returns:
            A boolean whether or not self and other_user share at least one
                course.
        """
        return len(self.courses_set.intersection(other_user.courses_set)) > 0

    def shared_courses(self, other_user):
        """Determines the courses shared by two users.

        Args:
            other_user: A User object.

        Returns:
            A sorted list of course names (strings) that self and other_user
                share.
        """
        shared_courses_set = self.courses_set.intersection(other_user.courses_set)
        return sorted(list(shared_courses_set))

    def gender_compatible(self, other_user):
        self_satisfied = (self.gender_preference == 'NONE'
                          or self.gender_preference == other_user.gender)
        other_satisfied = (other_user.gender_preference == 'NONE'
                          or other_user.gender_preference == self.gender)
        return self_satisfied and other_satisfied

    def shared_class_slots_UTC(self, other_user):
        earliest_start_dt_UTC = max(self.get_earliest_start_dt_UTC(),
                                    other_user.get_earliest_start_dt_UTC())
        self_availability_UTC = self.new_timezone_availability('UTC', earliest_start_dt_UTC)
        other_availability_UTC = other_user.new_timezone_availability('UTC', earliest_start_dt_UTC)
        return self_availability_UTC.shared_class_start_times(other_availability_UTC)

    def get_availability_matches(self, tutor, weeks_per_class):
        """Returns a list of potential matches between two users accounting for
        their availabilities after taking into account timezones and daylight 
        saving.

        Requires that self is a student
        """
        if self.user_type != 'STUDENT':
            raise ValueError('self must have user_type of "STUDENT"');
        if tutor.user_type != 'TUTOR':
            raise ValueError('tutor must have user_type of "TUTOR"');
        earliest_start_dt_UTC = max(self.get_earliest_start_dt_UTC(),
                                    tutor.get_earliest_start_dt_UTC())
        matches = []
        for wt_UTC in self.shared_class_slots_UTC(tutor):
            match = Match(self, tutor, wt_UTC, earliest_start_dt_UTC,
                          weeks_per_class)
            if match.daylight_saving_valid():
                matches.append(match)
        return matches

    def availability_matches(self, tutor, weeks_per_class):
        if self.user_type != 'STUDENT':
            raise ValueError('self must have user_type of "STUDENT"');
        if tutor.user_type != 'TUTOR':
            raise ValueError('tutor must have user_type of "TUTOR"');
        return len(self.get_availability_matches(tutor, weeks_per_class)) > 0

    def can_match(self, other_user, weeks_per_class):
        """Determines whether or not two users can be matched according to the
        availability, course, and gender constraints.

        Args:
            other_user: A User object.
            weeks_per_class: A positive integer representing the number of
                occurrences of the class, assuming the class meets once per
                week.

        Returns:
            A boolean whether or not self and other_user can be matched.
                Specifically, both users must share at least one class slot,
                share at least one course, and be gender compatible.
        """
        return (self.availability_matches(other_user, weeks_per_class)
                and self.share_course(other_user)
                and self.gender_compatible(other_user))

    def new_timezone_availability(self, new_tz_string, unlocalized_datetime_in_new_tz):
        """Returns an availability in a new timezone.

        Args:
            new_tz_string: A string representing the new time zone to shift to.
                Must be in the pytz timezone database.
            unlocalized_datetime_in_new_tz: An unlocalized datetime object that
                provides the reference time in the timezone new_tz_string with
                which to calculate UTC offsets.

        Returns:
            new_availability: An Availability object representing
                self.availability in the timezone new_tz_string using
                unlocalized_datetime_in_new_tz as a reference.
        """
        if new_tz_string not in set(pytz.all_timezones):
            raise ValueError('new_tz must be in the pytz timezone database')
        new_availability = self.availability.new_timezone(self.tz_string,
                                                          new_tz_string,
                                                          unlocalized_datetime_in_new_tz)
        return new_availability

        
